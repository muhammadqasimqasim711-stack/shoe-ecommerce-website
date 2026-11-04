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

export const Route = createFileRoute("/admin/cms/pages/")({
  component: CmsPagesIndex,
});

function CmsPagesIndex() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "cms", "pages", search, status],
    queryFn: () =>
      api.admin.cms.pages({ search: search || undefined, status: status || undefined, limit: 100 }),
  });
  const items = data?.items ?? [];

  const publish = useMutation({
    mutationFn: ({ id, on }: { id: string; on: boolean }) =>
      on ? api.admin.cms.publishPage(id) : api.admin.cms.unpublishPage(id),
    onSuccess: () => {
      toast.success("Page status updated");
      void qc.invalidateQueries({ queryKey: ["admin", "cms"] });
    },
    onError: () => toast.error("Could not update page"),
  });
  const remove = useMutation({
    mutationFn: () => api.admin.cms.deletePage(deleteId!),
    onSuccess: () => {
      toast.success("Page deleted");
      setDeleteId(null);
      void qc.invalidateQueries({ queryKey: ["admin", "cms"] });
    },
    onError: () => toast.error("Could not delete page"),
  });

  return (
    <div>
      <PageHeader
        title="Pages"
        description="About, legal, help, and custom pages"
        actions={
          <Button asChild>
            <Link to="/admin/cms/pages/new">Add page</Link>
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <DataTable
        columns={["Title", "Slug", "Type", "Status", "Actions"]}
        loading={isLoading}
        isEmpty={!items.length}
      >
        {items.map((p) => (
          <tr key={p.id} className="border-t border-border">
            <td className="p-3 font-medium">{p.title}</td>
            <td className="p-3 text-muted-foreground">{p.slug}</td>
            <td className="p-3">{p.type}</td>
            <td className="p-3">
              <StatusBadge status={p.status} />
            </td>
            <td className="p-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/admin/cms/pages/$id" params={{ id: p.id }}>
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
        title="Delete this page?"
        description="This cannot be undone."
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
