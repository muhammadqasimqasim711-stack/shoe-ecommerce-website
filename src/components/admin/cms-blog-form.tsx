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

type Props = { mode: "create" | "edit"; id?: string };

export function CmsBlogForm({ mode, id }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "cms", "blog", id],
    queryFn: () => api.admin.cms.blogPost(id!),
    enabled: mode === "edit" && Boolean(id),
  });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  useEffect(() => {
    if (!data) return;
    setTitle(data.title);
    setSlug(data.slug);
    setExcerpt(data.excerpt ?? "");
    setContent(data.content ?? "");
    setAuthorName(data.authorName ?? "");
    setCategory(data.category ?? "");
    setTags((data.tags ?? []).join(", "));
    setStatus(data.status);
    setFeaturedImageUrl(data.featuredImageUrl ?? "");
    setSeoTitle(data.seoTitle ?? "");
    setSeoDescription(data.seoDescription ?? "");
  }, [data]);

  const payload = () => ({
    title,
    slug,
    excerpt,
    content,
    authorName,
    category,
    tags: tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status,
    featuredImageUrl: featuredImageUrl || null,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
  });

  const save = useMutation({
    mutationFn: () =>
      mode === "create"
        ? api.admin.cms.createBlog(payload())
        : api.admin.cms.updateBlog(id!, payload()),
    onSuccess: () => {
      toast.success("Post saved");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "blog"] });
      void navigate({ to: "/admin/cms/blog" });
    },
    onError: () => toast.error("Could not save post"),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <PageHeader
        title={mode === "create" ? "Add post" : "Edit post"}
        backTo="/admin/cms/blog"
        actions={
          <Button type="submit" disabled={save.isPending}>
            Save
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input required value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div>
          <Label>Author</Label>
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <Label>Tags (comma separated)</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>DRAFT</option>
            <option>PUBLISHED</option>
            <option>SCHEDULED</option>
            <option>ARCHIVED</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Excerpt</Label>
        <Textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <Label>Featured image URL</Label>
        <Input value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} />
      </div>
      <div>
        <Label>SEO title</Label>
        <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
      </div>
      <div>
        <Label>SEO description</Label>
        <Textarea
          rows={2}
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
        />
      </div>
    </form>
  );
}
