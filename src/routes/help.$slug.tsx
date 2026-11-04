import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CmsHtml } from "@/components/cms-html";
import { api, ApiError } from "@/lib/api";
import { cmsDocumentHead } from "@/lib/cms-seo";

export const Route = createFileRoute("/help/$slug")({
  head: ({ loaderData, params }) =>
    cmsDocumentHead(loaderData, `${params.slug} — Help — SOLE`, `SOLE help: ${params.slug}`),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cms", "page", params.slug],
      queryFn: () => api.getCmsPage(params.slug),
    }),
  component: HelpSlugPage,
});

function HelpSlugPage() {
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const onContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.submitContact({ name: name.trim(), email: email.trim(), message: message.trim() });
      toast.success("Message sent — we'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error(
        err instanceof ApiError && err.status === 400
          ? "Check your name, email, and message."
          : "Could not send message. Is the backend running?",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/help" className="hover:underline">
            Help
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
              <Link to="/help">Back to Help</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-8">
              {page.title}
            </h1>
            <CmsHtml
              html={page.content}
              className="prose-sole text-muted-foreground leading-relaxed mb-10"
            />

            {slug === "contact" && (
              <form
                onSubmit={onContact}
                className="space-y-4 rounded-2xl border border-border p-6 bg-muted/20"
              >
                <h2 className="font-display text-xl font-black tracking-tight">Send a message</h2>
                <Input
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-full px-5"
                />
                <Input
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-full px-5"
                />
                <textarea
                  required
                  minLength={5}
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Button type="submit" className="rounded-full" disabled={sending}>
                  {sending ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
