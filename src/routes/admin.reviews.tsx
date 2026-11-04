import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviewsPage,
});

function AdminReviewsPage() {
  const [filter, setFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "reviews", filter],
    queryFn: () => api.admin.reviews({ approved: filter || undefined, limit: 100 }),
  });

  const update = useMutation({
    mutationFn: ({ id, approved, hidden }: { id: string; approved?: boolean; hidden?: boolean }) =>
      api.admin.updateReview(id, { approved, hidden }),
    onSuccess: () => {
      toast.success("Review updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => toast.error("Could not update review"),
  });

  const remove = useMutation({
    mutationFn: () => api.admin.deleteReview(deleteId!),
    onSuccess: () => {
      toast.success("Review deleted");
      setDeleteId(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
    onError: () => toast.error("Could not delete review"),
  });

  return (
    <div>
      <PageHeader
        title="Reviews"
        actions={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    {r.authorName} · {r.rating}/5
                  </div>
                  <div className="mb-2 text-xs text-muted-foreground">
                    <Link
                      to="/products/$id"
                      params={{ id: r.productId }}
                      className="hover:text-accent"
                    >
                      {r.productName}
                    </Link>{" "}
                    · {new Date(r.createdAt).toLocaleDateString()} ·{" "}
                    <StatusBadge
                      status={r.hidden ? "hidden" : r.approved ? "approved" : "pending"}
                    />
                  </div>
                  {r.title && <div className="text-sm font-medium">{r.title}</div>}
                  {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!r.approved && (
                    <Button
                      size="sm"
                      disabled={update.isPending}
                      onClick={() => update.mutate({ id: r.id, approved: true, hidden: false })}
                    >
                      Approve
                    </Button>
                  )}
                  {r.approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() => update.mutate({ id: r.id, approved: false })}
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={update.isPending}
                    onClick={() => update.mutate({ id: r.id, hidden: !r.hidden })}
                  >
                    {r.hidden ? "Unhide" : "Hide"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setDeleteId(r.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
          {data.length === 0 && <p className="text-sm text-muted-foreground">No reviews.</p>}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete this review?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
