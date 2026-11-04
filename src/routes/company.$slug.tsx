import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CmsHtml } from "@/components/cms-html";
import { api } from "@/lib/api";
import { cmsDocumentHead } from "@/lib/cms-seo";

export const Route = createFileRoute("/company/$slug")({
  head: ({ loaderData, params }) =>
    cmsDocumentHead(loaderData, `${params.slug} — Company — SOLE`, `SOLE company: ${params.slug}`),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cms", "page", params.slug],
      queryFn: () => api.getCmsPage(params.slug),
    }),
  component: CompanySlugPage,
});

function CompanySlugPage() {
  const { slug } = Route.useParams();
  const {
    data: page,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cms", "page", slug],
    queryFn: () => api.getCmsPage(slug),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/company" className="hover:underline">
            Company
          </Link>{" "}
          / {page?.title ?? slug}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : isError || !page ? (
          <div className="py-16 text-center">
            <h1 className="text-3xl font-black tracking-tighter mb-3">Page not found</h1>
            <Button asChild className="rounded-full">
              <Link to="/company">Back to Company</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-8">
              {page.title}
            </h1>
            <CmsHtml
              html={page.content}
              className="prose-sole text-muted-foreground leading-relaxed"
            />
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
