import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { ProductImage } from "@/components/product-image";
import { useCart, useWishlist } from "@/hooks/use-catalog";
import { useFlyCart } from "@/context/fly-cart-context";
import { useLocale } from "@/hooks/use-locale";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — SOLE" },
      { name: "description", content: "Your saved sneakers and footwear at SOLE." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, itemCount, isLoading, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { flyToCart } = useFlyCart();
  const { t, formatMoney } = useLocale();

  const handleRemove = async (itemId: string, name: string) => {
    try {
      await removeItem.mutateAsync(itemId);
      toast.success(`${name} removed from wishlist`);
    } catch {
      toast.error("Could not remove item.");
    }
  };

  const handleAddToCart = async (
    variantId: string | undefined,
    name: string,
    imgUrl?: string,
    clickEvent?: React.MouseEvent,
  ) => {
    if (clickEvent) {
      flyToCart(clickEvent, imgUrl);
    }
    if (!variantId) {
      toast.error("This product is not available yet.");
      return;
    }
    try {
      await addItem.mutateAsync(variantId);
      toast.success(`${name} added to cart`);
    } catch {
      toast.error("Could not add to cart.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            / Wishlist
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Wishlist</h1>
          <p className="text-muted-foreground mt-2">
            {isLoading && items.length === 0
              ? "Loading your saved products…"
              : `${itemCount} saved product${itemCount === 1 ? "" : "s"}`}
          </p>
        </div>

        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square rounded-2xl mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold tracking-tight mb-2">No saved products yet</h2>
            <p className="text-muted-foreground mb-6">
              Tap the heart on any sneaker to save it here.
            </p>
            <Button asChild className="rounded-full">
              <Link to="/shop">Browse shop</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => {
              const p = item.product;
              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between h-full bg-card/60 rounded-2xl p-3 border border-border/60 hover:border-accent transition-all shadow-xs"
                >
                  <div>
                    <div className="relative overflow-hidden rounded-xl bg-muted aspect-square mb-3">
                      <Link
                        to="/products/$id"
                        params={{ id: p.id }}
                        className="block h-full w-full"
                      >
                        <ProductImage
                          src={p.img}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove ${p.name}`}
                        disabled={removeItem.isPending}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.id, p.name);
                        }}
                        className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/90 backdrop-blur grid place-items-center hover:bg-destructive hover:text-destructive-foreground transition disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={addItem.isPending}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(p.defaultVariantId ?? item.variantId, p.name, p.img, e);
                        }}
                        className="absolute bottom-3 left-3 right-3 z-10 h-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-accent disabled:opacity-50"
                      >
                        {t("addToCart")}
                      </button>
                    </div>
                    <Link to="/products/$id" params={{ id: p.id }} className="block">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider truncate">
                            {p.brand}
                          </div>
                          <h3 className="font-semibold mt-1 line-clamp-1">{p.name}</h3>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-accent text-accent" /> {p.rating} (
                            {p.reviewCount})
                          </div>
                        </div>
                        <div className="shrink-0 text-right ml-2">
                          <div className="font-bold">{formatMoney(p.price, { round: true })}</div>
                          {p.oldPrice && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatMoney(p.oldPrice, { round: true })}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
