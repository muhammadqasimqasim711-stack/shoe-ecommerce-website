import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Journal — SOLE" },
      { name: "description", content: "Stories, drops, and news from SOLE." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cms", "blog"],
      queryFn: () => api.getCmsBlog(),
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cms", "blog"],
    queryFn: () => api.getCmsBlog(),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 font-display text-4xl font-black tracking-tighter">Journal</h1>
        {isLoading ? (
          <Skeleton className="h-40 rounded-xl" />
        ) : isError ? (
          <p className="text-muted-foreground">Could not load posts.</p>
        ) : data.length === 0 ? (
          <p className="text-muted-foreground">No published posts yet.</p>
        ) : (
          <div className="space-y-6">
            {data.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="block rounded-2xl border border-border p-6 hover:border-accent"
              >
                <div className="text-xs uppercase tracking-wider text-accent">
                  {p.category || "Journal"}
                </div>
                <h2 className="mt-1 text-2xl font-bold">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-muted-foreground">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
