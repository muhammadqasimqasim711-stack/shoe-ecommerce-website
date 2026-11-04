import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { api } from "@/lib/api";
import { formatMoney, ORDER_STATUSES } from "@/lib/staff";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderDetailPage,
});

function AdminOrderDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => api.admin.order(id),
  });

  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingStatus, setShippingStatus] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!data) return;
    setStatus(String(data.status ?? ""));
    setTrackingNumber(String(data.trackingNumber ?? ""));
    setShippingStatus(String(data.shippingStatus ?? ""));
  }, [data]);

  const update = useMutation({
    mutationFn: () =>
      api.admin.updateOrder(id, {
        status,
        trackingNumber: trackingNumber || undefined,
        shippingStatus: shippingStatus || undefined,
        note: note || undefined,
      }),
    onSuccess: () => {
      toast.success("Order updated");
      setNote("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "order", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => toast.error("Could not update order"),
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;
  if (isError || !data) return <p className="text-amber-600">Order not found.</p>;

  const items = (data.items as Array<Record<string, unknown>>) ?? [];
  const events = (data.statusEvents as Array<Record<string, unknown>>) ?? [];
  const user = data.user as {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title={`Order ${id.slice(0, 8)}…`}
        description={`${user?.email ?? data.email ?? "—"} · ${new Date(String(data.createdAt)).toLocaleString()}`}
        backTo="/admin/orders"
        backLabel="Orders"
        actions={<StatusBadge status={String(data.status)} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-border bg-background p-5">
          <h2 className="font-semibold">Update order</h2>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Tracking number</Label>
            <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Shipping status</Label>
            <Input
              value={shippingStatus}
              onChange={(e) => setShippingStatus(e.target.value)}
              placeholder="In transit, Out for delivery…"
            />
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button disabled={update.isPending} onClick={() => update.mutate()}>
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </section>

        <section className="space-y-3 rounded-xl border border-border bg-background p-5 text-sm">
          <h2 className="font-semibold">Summary</h2>
          <p>Subtotal: {formatMoney(Number(data.subtotal))}</p>
          <p>
            Shipping: {formatMoney(Number(data.shippingCost))} ({String(data.shippingMethod ?? "—")}
            )
          </p>
          <p>Discount: {formatMoney(Number(data.discountAmount))}</p>
          <p className="text-lg font-bold">Total: {formatMoney(Number(data.totalAmount))}</p>
          <p className="pt-2 text-muted-foreground">
            Ship to:{" "}
            {[data.shipName, data.shipLine1, data.shipCity, data.shipState, data.shipZip]
              .filter(Boolean)
              .join(", ") || "—"}
          </p>
          {user && (
            <p>
              Customer:{" "}
              <Link
                to="/admin/customers/$id"
                params={{ id: String((data.user as { id: string }).id) }}
                className="text-accent hover:underline"
              >
                {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}
              </Link>
            </p>
          )}
        </section>
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Items</h2>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li
              key={String(item.id)}
              className="flex justify-between rounded-lg border border-border p-3"
            >
              <span>
                {String(item.productName ?? "Item")}
                {item.size ? ` · ${String(item.size)}` : ""} × {Number(item.quantity)}
              </span>
              <span>{formatMoney(Number(item.price) * Number(item.quantity))}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Timeline</h2>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No status events yet.</p>
        ) : (
          <ol className="space-y-3 border-l border-border pl-4">
            {events.map((ev) => (
              <li key={String(ev.id)} className="relative text-sm">
                <span className="absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full bg-accent" />
                <div className="font-medium">{String(ev.status ?? ev.toStatus ?? "Update")}</div>
                {ev.note ? <div className="text-muted-foreground">{String(ev.note)}</div> : null}
                <div className="text-xs text-muted-foreground">
                  {new Date(String(ev.createdAt)).toLocaleString()}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
