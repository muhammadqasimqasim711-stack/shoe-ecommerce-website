import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/cms/")({
  component: CmsDashboardPage,
});

function CmsDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "cms", "dashboard"],
    queryFn: () => api.admin.cms.dashboard(),
  });

  const cards = data
    ? [
        { label: "Published pages", value: data.publishedPages, to: "/admin/cms/pages" },
        { label: "Draft pages", value: data.draftPages, to: "/admin/cms/pages" },
        { label: "Active banners", value: data.activeBanners, to: "/admin/cms/banners" },
        { label: "Categories", value: data.categories, to: "/admin/categories" },
        { label: "Blog posts", value: data.blogPosts, to: "/admin/cms/blog" },
        { label: "Media files", value: data.mediaFiles, to: "/admin/cms/media" },
      ]
    : [];

  return (
    <div>
      <PageHeader title="CMS" description="Manage storefront content without changing code" />
      {isError && <p className="mb-4 text-sm text-amber-600">Could not load CMS stats.</p>}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="rounded-xl border border-border bg-background p-5 hover:border-accent"
            >
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                {c.label}
              </div>
              <div className="text-2xl font-bold">{c.value}</div>
            </Link>
          ))}
        </div>
      )}
      <h2 className="mb-3 font-semibold">Recent content changes</h2>
      <div className="space-y-2">
        {(data?.recentChanges ?? []).map((row) => (
          <div
            key={`${row.entity}-${row.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm"
          >
            <div>
              <span className="mr-2 text-xs uppercase text-muted-foreground">{row.entity}</span>
              {row.title}
            </div>
            <StatusBadge status={row.status} />
          </div>
        ))}
        {!isLoading && !data?.recentChanges.length && (
          <p className="text-sm text-muted-foreground">No recent CMS edits yet.</p>
        )}
      </div>
    </div>
  );
}
