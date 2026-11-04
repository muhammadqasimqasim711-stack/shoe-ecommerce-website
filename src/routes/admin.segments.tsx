import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { CUSTOMER_SEGMENTS, formatMoney } from "@/lib/staff";

export const Route = createFileRoute("/admin/segments")({
  component: AdminSegmentsPage,
});

function AdminSegmentsPage() {
  const [segment, setSegment] = useState("vip");

  const { data: stats } = useQuery({
    queryKey: ["admin", "crm-stats"],
    queryFn: () => api.admin.crmStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers", "segment", segment],
    queryFn: () => api.admin.customers({ segment, limit: 100 }),
  });

  const items = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Customer segments"
        description="Filter customers by engagement, lifecycle, and spend"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/crm"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              CRM Dashboard
            </Link>
            {CUSTOMER_SEGMENTS.map((s) => {
              const count = stats?.segments?.[s.value as keyof typeof stats.segments];
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSegment(s.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    segment === s.value
                      ? "border-accent bg-accent text-accent-foreground shadow-sm"
                      : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                  {typeof count === "number" && (
                    <span className="ml-1.5 rounded-full bg-background/40 px-1.5 py-0.5 text-[10px]">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        }
      />

      <DataTable
        columns={["Customer", "Orders", "Spent", "Last order", "Status"]}
        loading={isLoading}
        isEmpty={items.length === 0}
        empty={`No customers in the “${segment}” segment.`}
      >
        {items.map((c) => (
          <tr key={c.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="p-3">
              <Link
                to="/admin/customers/$id"
                params={{ id: c.id }}
                className="text-accent hover:underline"
              >
                {c.name || c.email}
              </Link>
            </td>
            <td className="p-3">{c.totalOrders}</td>
            <td className="p-3">{formatMoney(c.totalSpending)}</td>
            <td className="p-3">
              {c.lastOrder ? new Date(c.lastOrder.createdAt).toLocaleDateString() : "—"}
            </td>
            <td className="p-3">
              <StatusBadge status={c.accountStatus || (c.disabled ? "disabled" : "active")} />
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
