import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { ProductImage } from "@/components/product-image";
import { WishlistButton } from "@/components/wishlist-button";
import { useCart } from "@/hooks/use-catalog";
import { useFlyCart } from "@/context/fly-cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { api, ApiError } from "@/lib/api";

export const Route = createFileRoute("/products/$id")({
  head: ({ loaderData, params }) => {
    const product = loaderData as import("@/lib/types").ProductDetail | undefined;
    const title = product?.name ? `${product.name} — SOLE Footwear` : "Product — SOLE";
    const description =
      product?.description?.slice(0, 160) ||
      `Shop ${product?.name ?? "premium footwear"} online at SOLE. Free shipping over $75 with 30-day hassle-free returns.`;
    const image = product?.images?.[0]?.url || "";

    const structuredData = product
      ? {
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: image ? [image] : undefined,
          description: product.description || undefined,
          brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: Number(product.price) || 0,
            availability: "https://schema.org/InStock",
            url: `https://sole-shoes.vercel.app/products/${product.id}`,
          },
        }
      : null;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
      scripts: structuredData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(structuredData),
            },
          ]
        : [],
    };
  },
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData({
        queryKey: ["products", "detail", params.id],
        queryFn: () => api.getProduct(params.id),
      })
      .catch(() => undefined),
  component: ProductDetailPage,
});

function StarRow({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}

function isLightColor(color: string) {
  const c = color.trim().toLowerCase();
  return c === "#fff" || c === "#ffffff" || c === "white";
}

function imageIndexForColor(
  images: Array<{ altText?: string | null }>,
  color: string | null,
  colorList: string[],
) {
  if (!color) return 0;
  const byAlt = images.findIndex((img) => img.altText === color);
  if (byAlt >= 0) return byAlt;
  const byList = colorList.indexOf(color);
  return byList >= 0 ? byList : 0;
}

function ProductDetailPage() {
  const { id } = Route.useParams();
  const { addItem } = useCart();
  const { flyToCart } = useFlyCart();
  const { isAuthenticated } = useAuth();
  const { t, formatMoney } = useLocale();
  const queryClient = useQueryClient();
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => api.getProduct(id),
    staleTime: 60_000,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", "product", id],
    queryFn: () => api.getReviews({ productId: id, limit: 50 }),
    staleTime: 30_000,
  });

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const sizes = useMemo(() => {
    if (!product) return [] as string[];
    return [
      ...new Set(
        product.variants
          .map((v) => v.size)
          .filter((s): s is string => Boolean(s && s !== "Default")),
      ),
    ];
  }, [product]);

  const colors = useMemo(() => {
    if (!product) return [] as string[];
    return [
      ...new Set(
        product.variants
          .map((v) => v.color)
          .filter((c): c is string => Boolean(c && c !== "Default")),
      ),
    ];
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const sizeOpts = [
      ...new Set(
        product.variants
          .map((v) => v.size)
          .filter((s): s is string => Boolean(s && s !== "Default")),
      ),
    ];
    const colorOpts = [
      ...new Set(
        product.variants
          .map((v) => v.color)
          .filter((c): c is string => Boolean(c && c !== "Default")),
      ),
    ];
    const first = product.variants.find((v) => v.stock > 0) ?? product.variants[0] ?? null;
    const nextSize = first?.size && first.size !== "Default" ? first.size : (sizeOpts[0] ?? null);
    const nextColor =
      first?.color && first.color !== "Default" ? first.color : (colorOpts[0] ?? null);
    setSelectedSize(nextSize);
    setSelectedColor(nextColor);
    setActiveImage(imageIndexForColor(product.images, nextColor, colorOpts));
  }, [product]);

  const selectColor = (color: string) => {
    setSelectedColor(color);
    if (product) {
      setActiveImage(imageIndexForColor(product.images, color, colors));
    }
  };

  const selectedVariant = useMemo(() => {
    if (!product?.variants.length) return null;
    const match = product.variants.find((v) => {
      const sizeOk = !selectedSize || !v.size || v.size === "Default" || v.size === selectedSize;
      const colorOk =
        !selectedColor || !v.color || v.color === "Default" || v.color === selectedColor;
      return sizeOk && colorOk;
    });
    return match ?? product.variants[0] ?? null;
  }, [product, selectedSize, selectedColor]);

  const price = product ? Number(product.card.price ?? product.price) : 0;
  const oldPrice = product?.card.oldPrice;
  const inStock = (selectedVariant?.stock ?? 0) > 0;

  const displayRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : (product?.card.rating ?? 0);
  const displayCount = reviews.length > 0 ? reviews.length : (product?.card.reviewCount ?? 0);

  const createReview = useMutation({
    mutationFn: () =>
      api.createReview(id, {
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        comment: reviewComment.trim() || undefined,
      }),
    onSuccess: async () => {
      toast.success("Thanks for your review!");
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reviews", "product", id] }),
        queryClient.invalidateQueries({ queryKey: ["products", "detail", id] }),
        queryClient.invalidateQueries({ queryKey: ["reviews"] }),
      ]);
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        toast.error("You have already reviewed this product.");
        return;
      }
      if (err instanceof ApiError && err.status === 401) {
        toast.error("Please sign in to leave a review.");
        return;
      }
      toast.error("Could not submit review. Is the backend running?");
    },
  });

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e && product) {
      const activeImgUrl = product.images[activeImage]?.url ?? product.card.img;
      flyToCart(e.currentTarget as HTMLElement, activeImgUrl);
    }
    if (!selectedVariant) {
      toast.error("This product is not available yet.");
      return;
    }
    if (!inStock) {
      toast.error("Selected size is out of stock.");
      return;
    }
    try {
      await addItem.mutateAsync(selectedVariant.id);
      toast.success(`${product!.name} added to cart`);
    } catch {
      toast.error("Could not add to cart. Is the backend running?");
    }
  };

  const onSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/shop" className="hover:underline">
            Shop
          </Link>{" "}
          / {product?.name ?? "Product"}
        </div>

        {isLoading ? (
          <div className="grid lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        ) : isError || !product ? (
          <div className="py-20 text-center">
            <h1 className="text-3xl font-black tracking-tighter mb-3">Product not found</h1>
            <p className="text-muted-foreground mb-6">This product may be unavailable.</p>
            <Button asChild className="rounded-full">
              <Link to="/shop">Back to shop</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
              <div>
                <div className="relative overflow-hidden rounded-2xl bg-muted aspect-square mb-3">
                  <ProductImage
                    src={product.images[activeImage]?.url ?? product.card.img}
                    alt={product.images[activeImage]?.altText ?? product.name}
                    className="h-full w-full object-cover"
                  />
                  {product.card.tag && (
                    <Badge
                      className={`absolute top-4 left-4 rounded-full px-3 ${
                        product.card.tag.startsWith("-")
                          ? "bg-accent text-accent-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {product.card.tag}
                    </Badge>
                  )}
                  <WishlistButton product={product.card} className="absolute top-4 right-4" />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((img, i) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                          i === activeImage ? "border-accent" : "border-transparent"
                        }`}
                      >
                        <ProductImage
                          src={img.url}
                          alt={img.altText ?? `${product.name} ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {product.brand?.name ?? product.card.brand}
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {displayCount > 0 ? (
                    <>
                      {displayRating} ({displayCount} {t("reviews").toLowerCase()})
                    </>
                  ) : (
                    t("noReviewsYet")
                  )}
                </div>

                <div className="flex items-baseline gap-3 mb-8">
                  <span className="text-3xl font-bold">{formatMoney(price, { round: true })}</span>
                  {oldPrice != null && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatMoney(oldPrice, { round: true })}
                    </span>
                  )}
                </div>

                {sizes.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold mb-3">{t("size")}</div>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-12 h-11 px-3 rounded-full border text-sm font-medium transition ${
                            selectedSize === size
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border hover:border-accent"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold mb-3">{t("color")}</div>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => {
                        const isHex = color.startsWith("#");
                        const light = isLightColor(color);
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => selectColor(color)}
                            aria-label={color}
                            title={color}
                            className={`h-10 w-10 rounded-full border-2 transition ${
                              selectedColor === color ? "border-accent scale-110" : "border-border"
                            } ${light ? "ring-1 ring-black/30" : ""}`}
                            style={isHex ? { background: color } : undefined}
                          >
                            {!isHex && <span className="text-[10px] font-medium">{color}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mb-6">
                  {inStock ? t("inStock") : t("outOfStock")}
                  {selectedVariant?.size ? ` · ${t("size")} ${selectedVariant.size}` : ""}
                  {selectedVariant?.color && selectedVariant.color !== "Default"
                    ? ` · ${selectedVariant.color}`
                    : ""}
                </p>

                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto min-w-48"
                  disabled={addItem.isPending || !selectedVariant || !inStock}
                  onClick={handleAddToCart}
                >
                  {addItem.isPending ? "…" : t("addToCart")}
                </Button>

                {product.description && (
                  <div className="mt-10 pt-8 border-t border-border">
                    <h2 className="font-semibold mb-3">{t("aboutProduct")}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="font-display text-3xl font-black tracking-tighter mb-2">
                {t("reviews")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {displayCount > 0
                  ? `${displayRating} average · ${displayCount} review${displayCount === 1 ? "" : "s"}`
                  : "Be the first to review this product."}
              </p>

              <div className="grid lg:grid-cols-[1fr_340px] gap-10">
                <div className="space-y-4">
                  {reviewsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">No reviews yet.</p>
                  ) : (
                    reviews.map((r) => (
                      <article key={r.id} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="font-semibold text-sm">{r.authorName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <StarRow rating={r.rating} />
                        </div>
                        {r.title && <h3 className="font-semibold mb-1">{r.title}</h3>}
                        {r.comment && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {r.comment}
                          </p>
                        )}
                      </article>
                    ))
                  )}
                </div>

                <aside className="rounded-2xl border border-border bg-muted/30 p-6 h-fit">
                  <h3 className="font-semibold mb-4">{t("writeReview")}</h3>
                  {isAuthenticated ? (
                    <form onSubmit={onSubmitReview} className="space-y-4">
                      <div>
                        <div className="text-sm mb-2">Your rating</div>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const value = i + 1;
                            return (
                              <button
                                key={value}
                                type="button"
                                aria-label={`${value} stars`}
                                onClick={() => setReviewRating(value)}
                                className="p-0.5"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    value <= reviewRating
                                      ? "fill-accent text-accent"
                                      : "text-muted-foreground/40"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <Input
                        placeholder="Title (optional)"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        maxLength={120}
                      />
                      <textarea
                        placeholder="Share your experience (optional)"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        maxLength={2000}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <Button
                        type="submit"
                        className="rounded-full w-full"
                        disabled={createReview.isPending}
                      >
                        {createReview.isPending ? "Submitting…" : "Submit review"}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Sign in to share your experience with this product.
                      </p>
                      <Button asChild className="rounded-full w-full">
                        <Link to="/login">{t("signInToReview")}</Link>
                      </Button>
                    </div>
                  )}
                </aside>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
