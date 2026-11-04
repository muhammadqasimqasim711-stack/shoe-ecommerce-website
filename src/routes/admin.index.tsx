import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/staff";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.admin.stats(),
    enabled: typeof window !== "undefined",
  });

  const cards = data
    ? [
        { label: "Total sales", value: formatMoney(data.totalSales), to: "/admin/analytics" },
        { label: "Today's sales", value: formatMoney(data.todaySales), to: "/admin/orders" },
        { label: "Orders", value: String(data.totalOrders), to: "/admin/orders" },
        { label: "Pending", value: String(data.pendingOrders), to: "/admin/orders" },
        { label: "Customers", value: String(data.totalCustomers), to: "/admin/customers" },
        { label: "Products", value: String(data.totalProducts), to: "/admin/products" },
        { label: "Low stock", value: String(data.lowStockProducts), to: "/admin/inventory" },
        { label: "Completed", value: String(data.completedOrders), to: "/admin/orders" },
      ]
    : [];

  const maxRevenue = Math.max(1, ...(data?.salesOverview.map((d) => d.revenue) ?? [1]));

  return (
    <div>
      <PageHeader title="Dashboard" description="Store performance at a glance" />
      {isError && (
        <p className="mb-4 text-sm text-amber-600">Could not load stats. Is the backend running?</p>
      )}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="rounded-xl border border-border bg-background p-5 transition hover:border-accent"
              >
                <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </div>
                <div className="text-2xl font-bold">{c.value}</div>
              </Link>
            ))}
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border bg-background p-5">
              <h2 className="mb-4 font-semibold">Sales overview (7 days)</h2>
              <div className="flex h-40 items-end gap-2">
                {(data?.salesOverview ?? []).map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-accent/80"
                      style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 100)}%` }}
                      title={formatMoney(d.revenue)}
                    />
                    <span className="text-[10px] text-muted-foreground">{d.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-background p-5">
              <h2 className="mb-3 font-semibold">Orders by status</h2>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {Object.entries(data?.orderStatusOverview ?? {}).map(([status, count]) => (
                  <li
                    key={status}
                    className="flex items-center justify-between border-b border-border/60 py-2"
                  >
                    <StatusBadge status={status} />
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
                {!Object.keys(data?.orderStatusOverview ?? {}).length && (
                  <li className="text-muted-foreground">No orders yet.</li>
                )}
              </ul>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-1">
              <h2 className="mb-3 font-semibold">Recent orders</h2>
              <DataTable
                columns={["Order", "Status", "Total"]}
                isEmpty={!data?.recentOrders.length}
                empty="No recent orders."
              >
                {data?.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border/60 hover:bg-muted/40">
                    <td className="p-3">
                      <Link
                        to="/admin/orders/$id"
                        params={{ id: o.id }}
                        className="text-accent hover:underline"
                      >
                        {o.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="p-3">{formatMoney(o.totalAmount, o.currency)}</td>
                  </tr>
                ))}
              </DataTable>
            </section>

            <section>
              <h2 className="mb-3 font-semibold">Best sellers</h2>
              <DataTable
                columns={["Product", "Sold"]}
                isEmpty={!data?.bestSellingProducts.length}
                empty="No sales data."
              >
                {data?.bestSellingProducts.slice(0, 8).map((p) => (
                  <tr key={p.id} className="border-b border-border/60 hover:bg-muted/40">
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
              <h2 className="mb-3 font-semibold">Low stock</h2>
              <DataTable
                columns={["Item", "Stock"]}
                isEmpty={!data?.lowStockList.length}
                empty="Inventory looks healthy."
              >
                {data?.lowStockList.map((v) => (
                  <tr key={v.variantId} className="border-b border-border/60 hover:bg-muted/40">
                    <td className="p-3">
                      <Link
                        to="/admin/products/$id"
                        params={{ id: v.productId }}
                        className="text-accent hover:underline"
                      >
                        {v.productName}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {[v.size, v.color].filter(Boolean).join(" · ")}
                      </div>
                    </td>
                    <td className="p-3 text-amber-700">
                      {v.stock}/{v.threshold}
                    </td>
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
