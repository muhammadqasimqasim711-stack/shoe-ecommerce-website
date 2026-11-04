import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { useBrands } from "@/hooks/use-catalog";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — SOLE" },
      { name: "description", content: "Shop premium sneaker brands at SOLE." },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const { data: brands = [], isLoading, isError } = useBrands();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            / Brands
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Shop by Brand</h1>
          <p className="text-muted-foreground mt-2">
            Browse our curated roster of performance and lifestyle labels.
          </p>
        </div>

        {isError && (
          <p className="mb-6 text-sm text-amber-600">
            Could not load brands. Start the backend on port 3001.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))
            : brands.map((brand) => (
                <Link
                  key={brand.id}
                  to="/shop"
                  search={{ brand: brand.name }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-accent transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-display text-xl font-black tracking-tight">
                      {brand.name}
                    </div>
                    {brand.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {brand.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 text-accent" />
                </Link>
              ))}
        </div>
      </main>
    </div>
  );
}
