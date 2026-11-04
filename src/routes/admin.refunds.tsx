import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/staff";

export const Route = createFileRoute("/admin/refunds")({
  component: AdminRefundsPage,
});

function AdminRefundsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "refunds"],
    queryFn: () => api.admin.refunds(100),
  });

  return (
    <div>
      <PageHeader title="Refunds" description={`${data.length} records`} />
      <DataTable
        columns={["Refund", "Order", "Amount", "Status", "Date"]}
        loading={isLoading}
        isEmpty={data.length === 0}
        empty="No refunds yet."
      >
        {data.map((r) => (
          <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="p-3">{r.id.slice(0, 8)}…</td>
            <td className="p-3">
              <Link
                to="/admin/orders/$id"
                params={{ id: r.orderId }}
                className="text-accent hover:underline"
              >
                {r.orderId.slice(0, 8)}…
              </Link>
            </td>
            <td className="p-3">{formatMoney(r.amount)}</td>
            <td className="p-3">
              <StatusBadge status={r.status} />
            </td>
            <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
