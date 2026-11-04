import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { ProductImage } from "@/components/product-image";
import { WishlistButton } from "@/components/wishlist-button";
import {
  useBrands,
  useCart,
  useCategories,
  useShopProducts,
  type ShopFilters,
} from "@/hooks/use-catalog";
import { useFlyCart } from "@/context/fly-cart-context";
import { useLocale } from "@/hooks/use-locale";
import { api } from "@/lib/api";
import type { ProductCard } from "@/lib/types";

function optionalOnSale(value: unknown): "true" | undefined {
  if (value === true || value === "true" || value === 1 || value === "1") return "true";
  return undefined;
}

function optionalDays(value: unknown): string | undefined {
  if (value == null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return undefined;
  return String(Math.trunc(n));
}

const shopSearchSchema = z.object({
  gender: z.enum(["men", "women", "kids", "unisex"]).optional(),
  onSale: z.preprocess(optionalOnSale, z.literal("true").optional()),
  sort: z.enum(["newest", "price_asc", "price_desc", "trending"]).optional(),
  days: z.preprocess(optionalDays, z.string().optional()),
  brand: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  collection: z.string().optional(),
});

type ShopSearch = z.infer<typeof shopSearchSchema>;

function parseShopSearch(search: Record<string, unknown>): ShopSearch {
  const result = shopSearchSchema.safeParse(search);
  if (result.success) return result.data;
  const raw = search ?? {};
  return {
    onSale: optionalOnSale(raw.onSale),
    days: optionalDays(raw.days),
    sort:
      raw.sort === "newest" ||
      raw.sort === "price_asc" ||
      raw.sort === "price_desc" ||
      raw.sort === "trending"
        ? raw.sort
        : undefined,
    gender:
      raw.gender === "men" ||
      raw.gender === "women" ||
      raw.gender === "kids" ||
      raw.gender === "unisex"
        ? raw.gender
        : undefined,
    brand: typeof raw.brand === "string" ? raw.brand : undefined,
    category: typeof raw.category === "string" ? raw.category : undefined,
    search: typeof raw.search === "string" ? raw.search : undefined,
    collection: typeof raw.collection === "string" ? raw.collection : undefined,
  };
}

function toProductParams(filters: ShopFilters) {
  const params: Record<string, string | number | boolean | undefined> = {
    limit: 100,
  };
  if (filters.gender) params.gender = filters.gender;
  if (filters.onSale === "true") params.onSale = true;
  if (filters.sort) params.sort = filters.sort;
  if (filters.days) params.days = Number(filters.days);
  if (filters.brand) params.brand = filters.brand;
  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;
  if (filters.collection) params.collection = filters.collection;
  return params;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search) => parseShopSearch(search as Record<string, unknown>),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const params = toProductParams(deps);
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["products", "shop", deps],
        queryFn: () => api.getProducts(params),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["brands"],
        queryFn: () => api.getBrands(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["categories"],
        queryFn: () => api.getCategories(),
      }),
    ]);
  },
  head: ({ match }) => {
    const search = match.search;
    const title = shopTitle(search ?? {});
    return {
      meta: [
        { title: `${title} — SOLE` },
        {
          name: "description",
          content: `Shop ${title.toLowerCase()} sneakers and footwear at SOLE.`,
        },
      ],
    };
  },
  component: ShopPage,
});

function shopTitle(search: ShopSearch, categoryName?: string): string {
  if (search.collection === "summer-26") return "Summer '26";
  if (search.onSale === "true") return "Sale";
  if (search.gender === "men") return "Men";
  if (search.gender === "women") return "Women";
  if (search.gender === "kids") return "Kids";
  if (search.sort === "newest" || search.days) return "New Arrivals";
  if (search.brand) return search.brand;
  if (search.category) return categoryName ?? titleCase(search.category);
  if (search.search) return `Results for “${search.search}”`;
  return "Shop";
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { data: products = [], isPending, isError, isFetching } = useShopProducts(search);
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { addItem } = useCart();
  const { flyToCart } = useFlyCart();
  const { t, formatMoney } = useLocale();
  const showSkeleton = isPending && products.length === 0;

  const categoryName = categories.find(
    (c) => c.id === search.category || c.name.toLowerCase() === search.category?.toLowerCase(),
  )?.name;
  const title = shopTitle(search, categoryName);

  const updateSearch = (patch: Partial<ShopSearch>) => {
    const next: ShopSearch = { ...search, ...patch };
    // Drop empty / cleared keys
    (Object.keys(next) as Array<keyof ShopSearch>).forEach((key) => {
      if (next[key] === undefined || next[key] === "" || next[key] === "all") {
        delete next[key];
      }
    });
    void navigate({ search: next });
  };

  const clearFilters = () => {
    void navigate({ search: {} });
  };

  const hasFilters = Boolean(
    search.gender ||
    search.category ||
    search.brand ||
    search.onSale ||
    search.sort ||
    search.days ||
    search.search ||
    search.collection,
  );

  const handleQuickAdd = async (product: ProductCard, clickEvent?: React.MouseEvent) => {
    if (clickEvent) {
      flyToCart(clickEvent, product.img);
    }
    if (!product.defaultVariantId) {
      toast.error("This product is not available yet.");
      return;
    }
    try {
      await addItem.mutateAsync(product.defaultVariantId);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Could not add to cart. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader search={search.search ?? ""} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              / Shop
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {showSkeleton
                ? "Loading…"
                : `${products.length} product${products.length === 1 ? "" : "s"}${isFetching ? " · updating" : ""}`}
            </p>
          </div>
          {hasFilters && (
            <Button type="button" variant="outline" className="rounded-full" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-3 items-center border border-border rounded-2xl bg-muted/30 p-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Gender
          </label>
          <select
            className="h-9 rounded-full border border-border bg-background px-3 text-sm"
            value={search.gender ?? "all"}
            onChange={(e) =>
              updateSearch({
                gender:
                  e.target.value === "all" ? undefined : (e.target.value as ShopSearch["gender"]),
              })
            }
          >
            <option value="all">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">
            Category
          </label>
          <select
            className="h-9 rounded-full border border-border bg-background px-3 text-sm"
            value={search.category ?? "all"}
            onChange={(e) =>
              updateSearch({ category: e.target.value === "all" ? undefined : e.target.value })
            }
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">
            Brand
          </label>
          <select
            className="h-9 rounded-full border border-border bg-background px-3 text-sm"
            value={search.brand ?? "all"}
            onChange={(e) =>
              updateSearch({ brand: e.target.value === "all" ? undefined : e.target.value })
            }
          >
            <option value="all">All</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 text-sm ml-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--accent)]"
              checked={search.onSale === "true"}
              onChange={(e) => updateSearch({ onSale: e.target.checked ? "true" : undefined })}
            />
            On sale
          </label>
        </div>

        {isError && (
          <p className="mb-6 text-sm text-amber-600">
            Could not load products. Start the backend on port 3001.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {showSkeleton
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square rounded-2xl mb-4" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            : products.map((p) => (
                <div
                  key={p.id}
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
                      {p.tag && (
                        <Badge
                          className={`absolute top-3 left-3 z-10 max-w-[calc(100%-3.5rem)] truncate rounded-full px-3 ${
                            p.tag.startsWith("-")
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {p.tag}
                        </Badge>
                      )}
                      <WishlistButton product={p} className="absolute top-3 right-3 z-10" />
                      <button
                        type="button"
                        disabled={addItem.isPending}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuickAdd(p, e);
                        }}
                        className="absolute bottom-3 left-3 right-3 z-10 h-9 sm:h-10 px-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-accent disabled:opacity-50"
                      >
                        {t("quickAdd")}
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
              ))}
        </div>

        {!showSkeleton && !isError && products.length === 0 && (
          <p className="text-muted-foreground py-16 text-center">No products match this filter.</p>
        )}
      </main>
    </div>
  );
}
