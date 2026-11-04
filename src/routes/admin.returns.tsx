import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { RETURN_STATUSES } from "@/lib/staff";

export const Route = createFileRoute("/admin/returns")({
  component: AdminReturnsPage,
});

function AdminReturnsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "returns", status],
    queryFn: () => api.admin.returns({ status: status || undefined, limit: 100 }),
  });

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ["admin", "return", selectedId],
    queryFn: () => api.admin.getReturn(selectedId!),
    enabled: !!selectedId,
  });

  const [editStatus, setEditStatus] = useState("");
  const [resolution, setResolution] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const create = useMutation({
    mutationFn: () =>
      api.admin.createReturn({ orderId: orderId.trim(), reason: reason || undefined }),
    onSuccess: () => {
      toast.success("Return created");
      setCreateOpen(false);
      setOrderId("");
      setReason("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "returns"] });
    },
    onError: () => toast.error("Could not create return"),
  });

  const update = useMutation({
    mutationFn: () =>
      api.admin.updateReturn(selectedId!, {
        status: editStatus || undefined,
        resolution: resolution || undefined,
        refundAmount: refundAmount ? Number(refundAmount) : undefined,
      }),
    onSuccess: () => {
      toast.success("Return updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "returns"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "return", selectedId] });
    },
    onError: () => toast.error("Could not update return"),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Returns"
        actions={
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All statuses</option>
              {RETURN_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button onClick={() => setCreateOpen(true)}>Create return</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable
          columns={["Return", "Order", "Status", "Date"]}
          loading={isLoading}
          isEmpty={data.length === 0}
        >
          {data.map((r) => (
            <tr
              key={r.id}
              className={`cursor-pointer border-b border-border/60 hover:bg-muted/40 ${selectedId === r.id ? "bg-muted/50" : ""}`}
              onClick={() => {
                setSelectedId(r.id);
                setEditStatus(r.status);
                setResolution(r.resolution ?? "");
                setRefundAmount(r.refundAmount != null ? String(r.refundAmount) : "");
              }}
            >
              <td className="p-3">{r.id.slice(0, 8)}…</td>
              <td className="p-3">
                <Link
                  to="/admin/orders/$id"
                  params={{ id: r.orderId }}
                  className="text-accent hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {r.orderId.slice(0, 8)}…
                </Link>
              </td>
              <td className="p-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </DataTable>

        <div className="rounded-xl border border-border bg-background p-5">
          {!selectedId ? (
            <p className="text-sm text-muted-foreground">Select a return to view details.</p>
          ) : detailLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="space-y-4">
              <h2 className="font-semibold">Return {selectedId.slice(0, 8)}…</h2>
              <p className="text-sm text-muted-foreground">
                Reason: {String(detail?.reason ?? "—")}
              </p>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {RETURN_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Resolution</Label>
                <Input value={resolution} onChange={(e) => setResolution(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Refund amount</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>
              <Button disabled={update.isPending} onClick={() => update.mutate()}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create return</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Order ID</Label>
              <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!orderId.trim() || create.isPending} onClick={() => create.mutate()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
