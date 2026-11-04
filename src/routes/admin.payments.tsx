import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/staff";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payments", status, page],
    queryFn: () =>
      api.admin.payments({
        status: status || undefined,
        page,
        limit: 25,
      }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 25;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <PageHeader
        title="Transactions"
        description={`${total} payment${total === 1 ? "" : "s"}`}
        actions={
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        }
      />

      <DataTable
        columns={["Payment", "Order", "Provider", "Amount", "Status", "Date"]}
        loading={isLoading}
        isEmpty={items.length === 0}
      >
        {items.map((p) => (
          <tr key={p.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="p-3">{p.id.slice(0, 8)}…</td>
            <td className="p-3">
              <Link
                to="/admin/orders/$id"
                params={{ id: p.orderId }}
                className="text-accent hover:underline"
              >
                {p.orderId.slice(0, 8)}…
              </Link>
            </td>
            <td className="p-3">{p.provider}</td>
            <td className="p-3">{formatMoney(p.amount)}</td>
            <td className="p-3">
              <StatusBadge status={p.status} />
            </td>
            <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </DataTable>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end gap-2 text-sm">
          <button
            type="button"
            className="rounded-md border px-3 py-1 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-md border px-3 py-1 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
