import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/lib/api";

const HELP_ORDER = ["shipping", "returns", "size-guide", "faq", "contact"];

export const Route = createFileRoute("/help/")({
  head: () => ({
    meta: [
      { title: "Help — SOLE" },
      {
        name: "description",
        content: "Shipping, returns, size guide, FAQ, and contact support at SOLE.",
      },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cms", "pages"],
      queryFn: () => api.getCmsPages(),
    }),
  component: HelpHubPage,
});

function HelpHubPage() {
  const {
    data: pages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cms", "pages"],
    queryFn: () => api.getCmsPages(),
    staleTime: 60_000,
  });

  const helpPages = HELP_ORDER.map((slug) => pages.find((p) => p.slug === slug)).filter(
    Boolean,
  ) as Array<{ slug: string; title: string }>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          / Help
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-3">
          Help Center
        </h1>
        <p className="text-muted-foreground mb-10">
          Answers on shipping, returns, sizing, and how to reach us.
        </p>

        {isError && (
          <p className="text-sm text-amber-600 mb-6">
            Could not load help pages. Is the backend running?
          </p>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-2xl" />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {helpPages.map((page) => (
              <li key={page.slug}>
                <Link
                  to="/help/$slug"
                  params={{ slug: page.slug }}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 hover:border-accent transition"
                >
                  <span className="font-semibold">{page.title}</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
