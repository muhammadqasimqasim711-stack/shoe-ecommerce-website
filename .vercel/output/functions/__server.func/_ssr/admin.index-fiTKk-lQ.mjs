import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-fiTKk-lQ.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["admin", "stats"],
		queryFn: () => api.admin.stats(),
		enabled: typeof window !== "undefined"
	});
	const cards = data ? [
		{
			label: "Total sales",
			value: formatMoney(data.totalSales),
			to: "/admin/analytics"
		},
		{
			label: "Today's sales",
			value: formatMoney(data.todaySales),
			to: "/admin/orders"
		},
		{
			label: "Orders",
			value: String(data.totalOrders),
			to: "/admin/orders"
		},
		{
			label: "Pending",
			value: String(data.pendingOrders),
			to: "/admin/orders"
		},
		{
			label: "Customers",
			value: String(data.totalCustomers),
			to: "/admin/customers"
		},
		{
			label: "Products",
			value: String(data.totalProducts),
			to: "/admin/products"
		},
		{
			label: "Low stock",
			value: String(data.lowStockProducts),
			to: "/admin/inventory"
		},
		{
			label: "Completed",
			value: String(data.completedOrders),
			to: "/admin/orders"
		}
	] : [];
	const maxRevenue = Math.max(1, ...data?.salesOverview.map((d) => d.revenue) ?? [1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dashboard",
			description: "Store performance at a glance"
		}),
		isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-amber-600",
			children: "Could not load stats. Is the backend running?"
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: c.to,
					className: "rounded-xl border border-border bg-background p-5 transition hover:border-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs uppercase tracking-wider text-muted-foreground",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-background p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-semibold",
						children: "Sales overview (7 days)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-40 items-end gap-2",
						children: (data?.salesOverview ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full rounded-t bg-accent/80",
								style: { height: `${Math.max(4, d.revenue / maxRevenue * 100)}%` },
								title: formatMoney(d.revenue)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: d.date.slice(5)
							})]
						}, d.date))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-background p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-semibold",
						children: "Orders by status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "grid gap-2 text-sm sm:grid-cols-2",
						children: [Object.entries(data?.orderStatusOverview ?? {}).map(([status, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between border-b border-border/60 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: count
							})]
						}, status)), !Object.keys(data?.orderStatusOverview ?? {}).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "No orders yet."
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "lg:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 font-semibold",
							children: "Recent orders"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
							columns: [
								"Order",
								"Status",
								"Total"
							],
							isEmpty: !data?.recentOrders.length,
							empty: "No recent orders.",
							children: data?.recentOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60 hover:bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/admin/orders/$id",
											params: { id: o.id },
											className: "text-accent hover:underline",
											children: [o.id.slice(0, 8), "…"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: formatMoney(o.totalAmount, o.currency)
									})
								]
							}, o.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-semibold",
						children: "Best sellers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns: ["Product", "Sold"],
						isEmpty: !data?.bestSellingProducts.length,
						empty: "No sales data.",
						children: data?.bestSellingProducts.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/60 hover:bg-muted/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/products/$id",
									params: { id: p.id },
									className: "text-accent hover:underline",
									children: p.name
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: p.sold
							})]
						}, p.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-semibold",
						children: "Low stock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						columns: ["Item", "Stock"],
						isEmpty: !data?.lowStockList.length,
						empty: "Inventory looks healthy.",
						children: data?.lowStockList.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/60 hover:bg-muted/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/products/$id",
									params: { id: v.productId },
									className: "text-accent hover:underline",
									children: v.productName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: [v.size, v.color].filter(Boolean).join(" · ")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3 text-amber-700",
								children: [
									v.stock,
									"/",
									v.threshold
								]
							})]
						}, v.variantId))
					})] })
				]
			})
		] })
	] });
}
//#endregion
export { AdminDashboard as component };
