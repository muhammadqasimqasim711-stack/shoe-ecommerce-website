import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/api";

const STATUSES = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"];

type Props = { mode: "create" | "edit"; id?: string };

export function CmsPageForm({ mode, id }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "cms", "page", id],
    queryFn: () => api.admin.cms.page(id!),
    enabled: mode === "edit" && Boolean(id),
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("page");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  useEffect(() => {
    if (!data) return;
    setTitle(data.title);
    setSlug(data.slug);
    setType(data.type);
    setContent(data.content);
    setStatus(data.status);
    setFeaturedImageUrl(data.featuredImageUrl ?? "");
    setSeoTitle(data.seoTitle ?? "");
    setSeoDescription(data.seoDescription ?? "");
    setSeoKeywords(data.seoKeywords ?? "");
    setCanonicalUrl(data.canonicalUrl ?? "");
    setOgTitle(data.ogTitle ?? "");
    setOgDescription(data.ogDescription ?? "");
    setOgImage(data.ogImage ?? "");
  }, [data]);

  const payload = () => ({
    title,
    slug,
    type,
    content,
    status,
    featuredImageUrl: featuredImageUrl || null,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
    seoKeywords: seoKeywords || null,
    canonicalUrl: canonicalUrl || null,
    ogTitle: ogTitle || null,
    ogDescription: ogDescription || null,
    ogImage: ogImage || null,
  });

  const save = useMutation({
    mutationFn: () =>
      mode === "create"
        ? api.admin.cms.createPage(payload())
        : api.admin.cms.updatePage(id!, payload()),
    onSuccess: () => {
      toast.success(mode === "create" ? "Page created" : "Page saved");
      void qc.invalidateQueries({ queryKey: ["admin", "cms"] });
      void navigate({ to: "/admin/cms/pages" });
    },
    onError: () => toast.error("Could not save page"),
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <PageHeader
        title={mode === "create" ? "Add page" : "Edit page"}
        backTo="/admin/cms/pages"
        actions={
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save"}
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Slug">
          <Input required value={slug} onChange={(e) => setSlug(e.target.value)} />
        </Field>
        <Field label="Type">
          <Input value={type} onChange={(e) => setType(e.target.value)} />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Content">
        <Textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} />
      </Field>
      <Field label="Featured image URL">
        <Input value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} />
      </Field>
      <h2 className="font-semibold">SEO</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO title">
          <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </Field>
        <Field label="Canonical URL">
          <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
        </Field>
      </div>
      <Field label="SEO description">
        <Textarea
          rows={3}
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
        />
      </Field>
      <Field label="Keywords">
        <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="OG title">
          <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} />
        </Field>
        <Field label="OG image">
          <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
        </Field>
      </div>
      <Field label="OG description">
        <Textarea
          rows={2}
          value={ogDescription}
          onChange={(e) => setOgDescription(e.target.value)}
        />
      </Field>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
