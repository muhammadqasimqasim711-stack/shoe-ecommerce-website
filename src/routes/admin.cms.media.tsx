import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/cms/media")({
  component: CmsMediaPage,
});

function CmsMediaPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "cms", "media", search],
    queryFn: () => api.admin.cms.media(search || undefined),
  });

  const upload = useMutation({
    mutationFn: (file: File) => api.admin.cms.uploadMedia(file),
    onSuccess: () => {
      toast.success("Uploaded");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "media"] });
    },
    onError: () => toast.error("Upload failed"),
  });
  const remove = useMutation({
    mutationFn: () => api.admin.cms.deleteMedia(deleteId!),
    onSuccess: () => {
      toast.success("Deleted");
      setDeleteId(null);
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "media"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Media library"
        description="Upload images and copy URLs for banners, pages, and products"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files"
          className="max-w-xs"
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
          }}
        />
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((m) => (
            <article key={m.id} className="rounded-xl border border-border bg-background p-3">
              {m.mimeType.startsWith("image/") ? (
                <img
                  src={m.url}
                  alt={m.altText ?? m.filename}
                  className="mb-2 h-32 w-full rounded object-cover"
                />
              ) : (
                <div className="mb-2 grid h-32 place-items-center rounded bg-muted text-xs">
                  {m.mimeType}
                </div>
              )}
              <div className="truncate text-sm font-medium">{m.filename}</div>
              <div className="text-xs text-muted-foreground">{Math.round(m.size / 1024)} KB</div>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(m.url);
                    toast.success("URL copied");
                  }}
                >
                  Copy URL
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(m.id)}>
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      {!isLoading && !data.length && <p className="text-sm text-muted-foreground">No media yet.</p>}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete this file?"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
