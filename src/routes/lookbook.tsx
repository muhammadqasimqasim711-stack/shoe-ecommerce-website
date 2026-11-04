import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { ProductImage } from "@/components/product-image";
import { api } from "@/lib/api";
import { useLocale } from "@/hooks/use-locale";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Summer '26 Lookbook — SOLE" },
      { name: "description", content: "Explore the SOLE Summer '26 collection lookbook." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["products", "lookbook", "summer-26"],
      queryFn: () => api.getProducts({ collection: "summer-26", limit: 100 }),
    }),
  component: LookbookPage,
});

function LookbookPage() {
  const { formatMoney } = useLocale();
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "lookbook", "summer-26"],
    queryFn: () => api.getProducts({ collection: "summer-26", limit: 100 }),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[oklch(0.08_0_0)] text-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
              Lookbook
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-4">
              Summer <span className="text-accent">'26</span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl mb-8">
              A curated edit of performance and lifestyle silhouettes for the season ahead.
            </p>
            <Button
              asChild
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/shop" search={{ collection: "summer-26" }}>
                Shop the collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          {isError && (
            <p className="text-sm text-amber-600 mb-6">
              Could not load lookbook. Is the backend running?
            </p>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground text-center py-16">
              No looks in this collection yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {products.map((p, i) => (
                <article key={p.id} className={`group ${i % 3 === 0 ? "md:col-span-2" : ""}`}>
                  <Link to="/products/$id" params={{ id: p.id }} className="block">
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-muted ${
                        i % 3 === 0 ? "aspect-[21/9] md:aspect-[2.4/1]" : "aspect-[4/5]"
                      }`}
                    >
                      <ProductImage
                        src={p.img}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {p.brand}
                        </div>
                        <h2 className="font-display text-2xl font-black tracking-tight">
                          {p.name}
                        </h2>
                      </div>
                      <div className="font-bold">{formatMoney(p.price, { round: true })}</div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/shop" search={{ collection: "summer-26" }}>
                Shop Summer '26
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
