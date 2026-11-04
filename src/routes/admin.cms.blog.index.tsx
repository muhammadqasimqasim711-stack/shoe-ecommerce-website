import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/cms/blog/")({
  component: CmsBlogIndex,
});

function CmsBlogIndex() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "cms", "blog"],
    queryFn: () => api.admin.cms.blog({ limit: 100 }),
  });
  const items = data?.items ?? [];
  const publish = useMutation({
    mutationFn: ({ id, on }: { id: string; on: boolean }) =>
      on ? api.admin.cms.publishBlog(id) : api.admin.cms.unpublishBlog(id),
    onSuccess: () => {
      toast.success("Post updated");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "blog"] });
    },
  });
  const remove = useMutation({
    mutationFn: () => api.admin.cms.deleteBlog(deleteId!),
    onSuccess: () => {
      toast.success("Post deleted");
      setDeleteId(null);
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "blog"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Blog"
        actions={
          <Button asChild>
            <Link to="/admin/cms/blog/new">Add post</Link>
          </Button>
        }
      />
      <DataTable
        columns={["Title", "Slug", "Status", "Actions"]}
        loading={isLoading}
        isEmpty={!items.length}
      >
        {items.map((p) => (
          <tr key={p.id} className="border-t border-border">
            <td className="p-3 font-medium">{p.title}</td>
            <td className="p-3 text-muted-foreground">{p.slug}</td>
            <td className="p-3">
              <StatusBadge status={p.status} />
            </td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/admin/cms/blog/$id" params={{ id: p.id }}>
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => publish.mutate({ id: p.id, on: p.status !== "PUBLISHED" })}
                >
                  {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(p.id)}>
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete this post?"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
