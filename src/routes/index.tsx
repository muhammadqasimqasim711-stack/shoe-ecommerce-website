import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductImage } from "@/components/product-image";
import { WishlistButton } from "@/components/wishlist-button";
import { useHomeCatalog, useCart, useBrands, pickDisplayProducts } from "@/hooks/use-catalog";
import { sectionPayload, str, useCmsBanners, useCmsHome, useCmsSettings } from "@/hooks/use-cms";
import { api, ApiError } from "@/lib/api";
import { cmsDocumentHead } from "@/lib/cms-seo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { FlashSaleCountdown } from "@/components/flash-sale-countdown";
import { NewsletterSubscription } from "@/components/newsletter-subscription";
import { useFlyCart } from "@/context/fly-cart-context";
import { useLocale } from "@/hooks/use-locale";
import type { CategoryCard, ProductCard } from "@/lib/types";
import heroSneaker from "@/assets/hero-sneaker.jpg";
import shoe1 from "@/assets/shoe-1.jpg";
import shoe2 from "@/assets/shoe-2.jpg";
import shoe3 from "@/assets/shoe-3.jpg";
import shoe4 from "@/assets/shoe-4.jpg";
import lifeRun from "@/assets/lifestyle-running.jpg";
import lifeLace from "@/assets/lifestyle-lace.jpg";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    try {
      await Promise.allSettled([
        context.queryClient.prefetchQuery({
          queryKey: ["catalog", "home"],
          queryFn: () => api.getHomeCatalog(),
        }),
        context.queryClient.prefetchQuery({
          queryKey: ["brands"],
          queryFn: () => api.getBrands(),
        }),
        context.queryClient.prefetchQuery({
          queryKey: ["cms", "home"],
          queryFn: () => api.getCmsHome(),
        }),
        context.queryClient.prefetchQuery({
          queryKey: ["cms", "nav"],
          queryFn: () => api.getCmsNav(),
        }),
        context.queryClient.prefetchQuery({
          queryKey: ["cms", "banners"],
          queryFn: () => api.getCmsBanners(),
        }),
      ]);
    } catch {
      // Graceful SSR degradation: never throw catastrophic SSR errors on prefetch
    }
    const settings = await context.queryClient
      .ensureQueryData({
        queryKey: ["cms", "settings"],
        queryFn: () => api.getCmsSettings(),
      })
      .catch(() => undefined);
    return { settings };
  },
  head: ({ loaderData }) => {
    const settings = loaderData?.settings;
    const seo = cmsDocumentHead(
      {
        title: settings?.defaultSeoTitle || "SOLE — Premium Sneakers & Performance Footwear",
        seoDescription:
          settings?.defaultSeoDescription ||
          "Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns.",
        ogImage: settings?.defaultOgImage,
        canonicalUrl: "/",
      },
      "SOLE — Premium Sneakers & Performance Footwear",
      "Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns.",
    );
    return {
      ...seo,
      links: [
        ...seo.links,
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap",
        },
      ],
    };
  },
  component: Home,
});

const fallbackProducts: ProductCard[] = [
  {
    id: "1",
    name: "Air Runner Pro",
    brand: "Nike",
    price: 189,
    oldPrice: 220,
    img: shoe1,
    tag: "New",
    colors: ["#fff", "#111", "#FF6B00"],
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: "2",
    name: "Court Legend High",
    brand: "Jordan",
    price: 245,
    img: shoe2,
    tag: "Trending",
    colors: ["#111", "#5a3a2a"],
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: "3",
    name: "Blaze Trail 3.0",
    brand: "Adidas",
    price: 159,
    oldPrice: 199,
    img: shoe3,
    tag: "-20%",
    colors: ["#FF6B00", "#111", "#fff"],
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: "4",
    name: "Classic Suede",
    brand: "Puma",
    price: 129,
    img: shoe4,
    tag: "Bestseller",
    colors: ["#c9a37a", "#111", "#fff"],
    rating: 4.8,
    reviewCount: 312,
  },
];

const fallbackCategories: CategoryCard[] = [
  { id: "running", name: "Running", count: 128, imageUrl: shoe3 },
  { id: "basketball", name: "Basketball", count: 64, imageUrl: shoe2 },
  { id: "lifestyle", name: "Lifestyle", count: 214, imageUrl: shoe4 },
  { id: "training", name: "Training", count: 92, imageUrl: shoe1 },
];

const fallbackBrands = [
  "NIKE",
  "ADIDAS",
  "PUMA",
  "NEW BALANCE",
  "JORDAN",
  "SKECHERS",
  "ASICS",
  "REEBOK",
];

const categoryFallbackImages = [shoe3, shoe2, shoe4, shoe1];

function Home() {
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("All");
  const { t, formatMoney } = useLocale();
  const { flyToCart } = useFlyCart();

  const { data: catalog, isLoading, isError, isSuccess } = useHomeCatalog();
  const { data: brandList = [] } = useBrands();
  const { addItem } = useCart();
  const { data: cmsHome } = useCmsHome();
  const { data: cmsBanners = [] } = useCmsBanners();
  const { data: cmsSettings } = useCmsSettings();
  const sections = cmsHome?.sections;
  const announcement = sectionPayload(sections, "announcement");
  const hero = sectionPayload(sections, "hero");
  const valueProps = sectionPayload(sections, "value_props");
  const catCopy = sectionPayload(sections, "featured_categories");
  const prodCopy = sectionPayload(sections, "featured_products");
  const split = sectionPayload(sections, "split");
  const flash = sectionPayload(sections, "flash_sale");
  const testimonials = sectionPayload(sections, "testimonials");
  const newsletter = sectionPayload(sections, "newsletter");
  const splitLeft = (split.left as Record<string, unknown> | undefined) ?? {};
  const splitRight = (split.right as Record<string, unknown> | undefined) ?? {};
  const valueItems = Array.isArray(valueProps.items)
    ? (valueProps.items as Array<{ title?: string; desc?: string }>)
    : [
        { title: "Free Shipping", desc: "On orders over $75" },
        { title: "30-Day Returns", desc: "Easy & free returns" },
        { title: "Authentic Guarantee", desc: "100% verified products" },
        { title: "24/7 Support", desc: "Always here to help" },
      ];
  const rawHeroStats = Array.isArray(hero.stats)
    ? (hero.stats as Array<{ value?: string; label?: string }>)
    : [
        { value: "2M+", label: "Customers" },
        { value: "500+", label: "Styles" },
        { value: "4.9\u2605", label: "Rated" },
      ];
  const heroStats = rawHeroStats.map((s) => ({
    ...s,
    value: s.value ? s.value.replace(/\?|\uFFFD/g, "\u2605") : "",
  }));
  const { data: featuredReviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", "featured"],
    queryFn: () => api.getReviews({ limit: 3 }),
    staleTime: 60_000,
  });

  const products = pickDisplayProducts(catalog, productFilter);
  const usingApi = isSuccess && Boolean(catalog?.products.length);
  const displayProducts = usingApi ? products : fallbackProducts;
  const displayCategories =
    usingApi && catalog?.categories?.length ? catalog.categories : fallbackCategories;
  const rawMarqueeBrands =
    brandList.length > 0
      ? brandList.map((b) => b.name)
      : usingApi && catalog?.brands?.length
        ? catalog.brands
        : fallbackBrands;
  const marqueeBrands = Array.from(new Set(rawMarqueeBrands.map((b) => b.toUpperCase())));

  const filteredProducts = displayProducts;

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
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          <span className="hidden sm:inline opacity-70">{t("freeShipping")}</span>
          <div className="flex-1 text-center font-medium tracking-wider">
            {str(announcement, "text", "LIMITED DROP · SUMMER '26 COLLECTION · ENDS SUNDAY")}
          </div>
          <div className="hidden sm:flex gap-4 opacity-70 items-center">
            <Link to="/help" className="hover:text-accent transition">
              {t("help")}
            </Link>
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* Header */}
      <SiteHeader search={search} onSearchChange={setSearch} />

      {cmsBanners.length > 0 && (
        <div className="bg-accent text-accent-foreground">
          {cmsBanners.slice(0, 1).map((b) => (
            <a
              key={b.id}
              href={b.buttonLink || "/shop"}
              className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-sm font-medium"
            >
              {b.desktopImageUrl ? (
                <img
                  src={b.desktopImageUrl}
                  alt=""
                  width={64}
                  height={40}
                  className="hidden h-10 w-16 object-cover sm:block"
                />
              ) : null}
              <span>
                {b.title}
                {b.subtitle ? ` — ${b.subtitle}` : ""}
              </span>
              {b.buttonText ? <span className="underline">{b.buttonText}</span> : null}
            </a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="relative overflow-hidden bg-[oklch(0.08_0_0)] text-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2 items-center gap-8 px-4 py-16 lg:py-24">
          <div className="relative z-10 space-y-6">
            <Link to="/shop" search={{ collection: "summer-26" }}>
              <Badge className="bg-accent text-accent-foreground rounded-full px-3 py-1 uppercase tracking-widest text-xs cursor-pointer hover:opacity-90">
                {str(hero, "badge", "Summer '26")}
              </Badge>
            </Link>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
              {str(hero, "heading", "Step Into the Future.")}
            </h1>
            <p className="text-lg text-white/60 max-w-md">
              {str(
                hero,
                "subtitle",
                "Engineered for the streets. Designed for the extraordinary. The new Air Runner Pro delivers unmatched comfort with a silhouette that defines the era.",
              )}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 h-12 font-semibold"
              >
                <a href={str(hero, "ctaUrl", "/shop?collection=summer-26")}>
                  {str(hero, "ctaText", "Shop Collection")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4 inline" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-12 border border-white/30 bg-white text-black hover:bg-white/90 font-semibold shadow-none"
              >
                <a href={str(hero, "secondaryCtaUrl", "/lookbook")}>
                  {str(hero, "secondaryCtaText", "Explore Lookbook")}
                </a>
              </Button>
            </div>
            <div className="flex gap-8 pt-8 border-t border-white/10">
              {heroStats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
            <div className="absolute top-8 right-8 font-display text-[10rem] lg:text-[14rem] font-black text-white/[0.04] leading-none pointer-events-none">
              01
            </div>
            <img
              src={heroSneaker}
              alt="Featured sneaker"
              width={1536}
              height={1536}
              className="relative w-full drop-shadow-[0_30px_60px_rgba(255,107,0,0.25)]"
            />
          </div>
        </div>
        {/* marquee */}
        <div className="border-y border-white/10 overflow-hidden py-4">
          <div className="marquee flex gap-16 whitespace-nowrap font-display font-black text-3xl text-white/30">
            {[...marqueeBrands, ...marqueeBrands].map((b, i) => (
              <Link
                key={`${b}-${i}`}
                to="/shop"
                search={{ brand: b }}
                className="flex items-center gap-16 hover:text-accent transition"
              >
                {b} <span className="text-accent">✦</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {valueItems.map((v, i) => {
            const Icon = [Truck, RotateCcw, ShieldCheck, Headphones][i] ?? Truck;
            return (
              <div key={v.title} className="flex items-center gap-4 px-6 py-6">
                <Icon className="h-8 w-8 text-accent" />
                <div>
                  <div className="font-semibold text-sm">{v.title}</div>
                  <div className="text-xs text-muted-foreground">{v.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
              {str(catCopy, "eyebrow", "Shop by Category")}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              {str(catCopy, "heading", "Find Your Fit")}
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-accent"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {displayCategories.map((c, i) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="group relative overflow-hidden rounded-2xl bg-muted aspect-[3/4]"
            >
              <img
                src={c.imageUrl ?? categoryFallbackImages[i % categoryFallbackImages.length]}
                alt={c.name}
                loading="lazy"
                width={600}
                height={800}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-xs opacity-70 uppercase tracking-wider">
                  {c.count} products
                </div>
                <div className="font-display text-3xl font-black mt-1 flex items-center gap-2">
                  {c.name}
                  <ArrowRight className="h-6 w-6 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-muted/40 py-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
                {str(prodCopy, "eyebrow", "Best Sellers")}
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                {str(prodCopy, "heading", "Trending Now")}
              </h2>
            </div>
            <div className="hidden md:flex gap-2">
              {[
                { label: "All", to: "/" as const, search: undefined },
                { label: "Men", to: "/shop" as const, search: { gender: "men" } },
                { label: "Women", to: "/shop" as const, search: { gender: "women" } },
                { label: "Kids", to: "/shop" as const, search: { gender: "kids" } },
              ].map((t) =>
                t.label === "All" ? (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setProductFilter("All")}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      productFilter === "All"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:border-accent"
                    }`}
                  >
                    All
                  </button>
                ) : (
                  <Link
                    key={t.label}
                    to={t.to}
                    search={t.search}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-background border border-border hover:border-accent"
                  >
                    {t.label}
                  </Link>
                ),
              )}
            </div>
          </div>
          {isError && (
            <p className="mb-6 text-sm text-amber-600">
              Backend offline — showing demo catalog. Start the API with{" "}
              <code className="text-xs">npm run start:dev</code> in{" "}
              <code className="text-xs">backend/</code>.
            </p>
          )}
          {usingApi && (
            <p className="mb-6 text-sm text-emerald-600">
              Live inventory connected · {displayProducts.length} products from API
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-square rounded-2xl mb-4" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))
              : filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group flex flex-col justify-between h-full bg-card/60 rounded-2xl p-3 border border-border/60 hover:border-accent transition-all shadow-xs"
                  >
                    <div>
                      <div className="relative overflow-hidden rounded-xl bg-background aspect-square mb-3">
                        <Link
                          to="/products/$id"
                          params={{ id: p.id }}
                          className="block h-full w-full"
                        >
                          <ProductImage
                            src={p.img}
                            alt={p.name}
                            loading="lazy"
                            width={800}
                            height={800}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        {p.tag && (
                          <Badge
                            className={`absolute top-3 left-3 z-10 max-w-[calc(100%-3.5rem)] truncate rounded-full px-3 ${p.tag.startsWith("-") ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}
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
                    <div className="flex gap-1.5 mt-2">
                      {p.colors.map((c, i) => (
                        <span
                          key={i}
                          className="h-3.5 w-3.5 rounded-full border border-border"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Split feature */}
      <section className="mx-auto max-w-7xl px-4 py-20 grid lg:grid-cols-2 gap-6">
        <Link
          to="/shop"
          search={{ category: "running" }}
          className="relative overflow-hidden rounded-3xl aspect-[4/5] lg:aspect-auto lg:min-h-[500px] group block cursor-pointer"
        >
          <img
            src={lifeRun}
            alt="Run"
            loading="lazy"
            width={1200}
            height={800}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-8 md:p-12 text-white space-y-4 max-w-md z-10">
            <Badge className="bg-accent text-accent-foreground rounded-full">
              {str(splitLeft, "badge", "Performance")}
            </Badge>
            <h3 className="font-display text-4xl md:text-5xl font-black leading-tight">
              {str(splitLeft, "heading", "Built for Every Mile.")}
            </h3>
            <p className="text-white/70">
              {str(
                splitLeft,
                "body",
                "Discover our running collection engineered with responsive foam and breathable knit uppers.",
              )}
            </p>
            <span className="inline-flex items-center justify-center rounded-full h-10 px-6 bg-accent text-accent-foreground font-medium text-sm group-hover:bg-accent/90 transition">
              {t("shopRunning")}
            </span>
          </div>
        </Link>
        <Link
          to="/shop"
          search={{ category: "lifestyle" }}
          className="relative overflow-hidden rounded-3xl aspect-[4/5] lg:aspect-auto lg:min-h-[500px] group block cursor-pointer"
        >
          <img
            src={lifeLace}
            alt="Style"
            loading="lazy"
            width={1200}
            height={800}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-8 md:p-12 text-white space-y-4 max-w-md z-10">
            <Badge className="bg-white text-black rounded-full">
              {str(splitRight, "badge", "Lifestyle")}
            </Badge>
            <h3 className="font-display text-4xl md:text-5xl font-black leading-tight">
              {str(splitRight, "heading", "Everyday Elevated.")}
            </h3>
            <p className="text-white/70">
              {str(
                splitRight,
                "body",
                "Timeless silhouettes crafted from premium materials for the modern wardrobe.",
              )}
            </p>
            <span className="inline-flex items-center justify-center rounded-full h-10 px-6 bg-white text-black font-medium text-sm group-hover:bg-white/90 transition">
              {t("shopLifestyle")}
            </span>
          </div>
        </Link>
      </section>

      {/* Flash sale */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Link to="/shop" search={{ onSale: "true" }}>
              <Badge className="bg-accent text-accent-foreground rounded-full mb-4 hover:opacity-90 cursor-pointer">
                Flash Sale
              </Badge>
            </Link>
            <h2 className="font-display text-5xl md:text-6xl font-black tracking-tighter mb-4">
              {str(flash, "heading", "Up to 50% Off Ends Tonight.")}
            </h2>
            <p className="text-white/60 mb-6">
              Premium performance footwear at unbeatable prices. Limited stock available.
            </p>
            <FlashSaleCountdown />
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8"
            >
              <Link to="/shop" search={{ onSale: "true" }}>
                Shop Sale
              </Link>
            </Button>
          </div>
          <Link to="/shop" search={{ onSale: "true" }} className="relative block">
            <div className="absolute inset-0 bg-accent/30 blur-3xl rounded-full" />
            <img
              src={shoe3}
              alt="Sale"
              loading="lazy"
              width={800}
              height={800}
              className="relative w-full rounded-3xl aspect-square object-cover"
            />
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            {str(testimonials, "eyebrow", "Customer Voices")}
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            {str(testimonials, "heading", "Real Reviews")}
          </h2>
        </div>
        {reviewsLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : featuredReviews.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No reviews yet — be the first on a product page.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredReviews.map((r) => {
              const cardClassName =
                "bg-card border border-border rounded-2xl p-6 hover:shadow-elegant transition-shadow block";
              const body = (
                <>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4">
                    &ldquo;{r.comment || r.title || "Great product."}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary" />
                    <div>
                      <div className="font-semibold text-sm">{r.authorName}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.productName || "Verified Buyer"}
                      </div>
                    </div>
                  </div>
                </>
              );
              return r.productId ? (
                <Link
                  key={r.id}
                  to="/products/$id"
                  params={{ id: r.productId }}
                  className={`${cardClassName} cursor-pointer`}
                >
                  {body}
                </Link>
              ) : (
                <div key={r.id} className={cardClassName}>
                  {body}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-muted/40 border-y border-border py-20">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-6">
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter">
            {str(
              newsletter,
              "heading",
              (typeof cmsSettings?.newsletterHeading === "string" &&
                cmsSettings.newsletterHeading) ||
                t("joinClub"),
            )}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {str(
              newsletter,
              "subtext",
              (typeof cmsSettings?.newsletterSubtext === "string" &&
                cmsSettings.newsletterSubtext) ||
                "Get 10% off your first order plus early access to drops, exclusive offers, and product launches.",
            )}
          </p>
          <NewsletterSubscription />
          <p className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
