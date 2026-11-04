import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/staff";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "analytics", range],
    queryFn: () => api.admin.analytics({ range }),
  });

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Revenue, customers, and product performance"
        actions={
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="365d">Last year</option>
          </select>
        }
      />

      {isError && <p className="mb-4 text-sm text-amber-600">Could not load analytics.</p>}
      {isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Revenue", value: formatMoney(data.revenue) },
              { label: "Orders", value: String(data.orders) },
              { label: "AOV", value: formatMoney(data.aov) },
              {
                label: "New / returning",
                value: `${data.newCustomers} / ${data.returningCustomers}`,
              },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-background p-5">
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </div>
                <div className="text-2xl font-bold">{c.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border bg-background p-5">
              <h2 className="mb-3 font-semibold">Orders by status</h2>
              <ul className="space-y-2 text-sm">
                {Object.entries(data.ordersByStatus).map(([status, count]) => (
                  <li key={status} className="flex justify-between border-b border-border/60 py-2">
                    <StatusBadge status={status} />
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                Cancelled: {data.cancelled} · Returned: {data.returned}
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-semibold">Low stock alerts</h2>
              <DataTable
                columns={["Product", "Stock"]}
                isEmpty={data.lowStock.length === 0}
                empty="No low stock items."
              >
                {data.lowStock.map((v) => (
                  <tr key={v.variantId} className="border-b border-border/60">
                    <td className="p-3">
                      <Link
                        to="/admin/products/$id"
                        params={{ id: v.productId }}
                        className="text-accent hover:underline"
                      >
                        {v.productName}
                      </Link>
                    </td>
                    <td className="p-3 text-amber-700">
                      {v.stock}/{v.threshold}
                    </td>
                  </tr>
                ))}
              </DataTable>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="mb-3 font-semibold">Best selling</h2>
              <DataTable columns={["Product", "Sold"]} isEmpty={data.bestSelling.length === 0}>
                {data.bestSelling.map((p) => (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="p-3">
                      <Link
                        to="/admin/products/$id"
                        params={{ id: p.id }}
                        className="text-accent hover:underline"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-3">{p.sold}</td>
                  </tr>
                ))}
              </DataTable>
            </section>
            <section>
              <h2 className="mb-3 font-semibold">Low selling</h2>
              <DataTable columns={["Product", "Sold"]} isEmpty={data.lowSelling.length === 0}>
                {data.lowSelling.map((p) => (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="p-3">
                      <Link
                        to="/admin/products/$id"
                        params={{ id: p.id }}
                        className="text-accent hover:underline"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-3">{p.sold}</td>
                  </tr>
                ))}
              </DataTable>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
