import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CmsHtml } from "@/components/cms-html";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { cmsDocumentHead } from "@/lib/cms-seo";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData, params }) =>
    cmsDocumentHead(
      loaderData,
      `${params.slug} — Journal — SOLE`,
      "Stories, drops, and news from SOLE.",
    ),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cms", "blog", params.slug],
      queryFn: () => api.getCmsBlogPost(params.slug),
    }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cms", "blog", slug],
    queryFn: () => api.getCmsBlogPost(slug),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/blog" className="text-xs text-accent hover:underline">
          ← Journal
        </Link>
        {isLoading ? (
          <Skeleton className="mt-6 h-64 rounded-xl" />
        ) : isError || !post ? (
          <p className="mt-8">Post not found.</p>
        ) : (
          <article className="mt-6">
            <div className="text-xs uppercase tracking-wider text-accent">{post.category}</div>
            <h1 className="mt-2 font-display text-4xl font-black tracking-tighter">{post.title}</h1>
            {post.authorName && (
              <p className="mt-2 text-sm text-muted-foreground">By {post.authorName}</p>
            )}
            {post.featuredImageUrl && (
              <img src={post.featuredImageUrl} alt="" className="my-6 w-full rounded-2xl" />
            )}
            <CmsHtml
              html={post.content}
              className="prose max-w-none text-muted-foreground leading-relaxed"
            />
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
