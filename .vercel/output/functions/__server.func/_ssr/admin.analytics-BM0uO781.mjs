import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-BM0uO781.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminAnalyticsPage() {
	const [range, setRange] = (0, import_react.useState)("30d");
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"admin",
			"analytics",
			range
		],
		queryFn: () => api.admin.analytics({ range })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Analytics",
			description: "Revenue, customers, and product performance",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: range,
				onChange: (e) => setRange(e.target.value),
				className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "7d",
						children: "Last 7 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "30d",
						children: "Last 30 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "90d",
						children: "Last 90 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "365d",
						children: "Last year"
					})
				]
			})
		}),
		isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-amber-600",
			children: "Could not load analytics."
		}),
		isLoading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						label: "Revenue",
						value: formatMoney(data.revenue)
					},
					{
						label: "Orders",
						value: String(data.orders)
					},
					{
						label: "AOV",
						value: formatMoney(data.aov)
					},
					{
						label: "New / returning",
						value: `${data.newCustomers} / ${data.returningCustomers}`
					}
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-background p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs uppercase tracking-wider text-muted-foreground",
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
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 font-semibold",
							children: "Orders by status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: Object.entries(data.ordersByStatus).map(([status, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between border-b border-border/60 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: count
								})]
							}, status))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: [
								"Cancelled: ",
								data.cancelled,
								" · Returned: ",
								data.returned
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-semibold",
					children: "Low stock alerts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					columns: ["Product", "Stock"],
					isEmpty: data.lowStock.length === 0,
					empty: "No low stock items.",
					children: data.lowStock.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/products/$id",
								params: { id: v.productId },
								className: "text-accent hover:underline",
								children: v.productName
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3 text-amber-700",
							children: [
								v.stock,
								"/",
								v.threshold
							]
						})]
					}, v.variantId))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-semibold",
					children: "Best selling"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					columns: ["Product", "Sold"],
					isEmpty: data.bestSelling.length === 0,
					children: data.bestSelling.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
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
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-semibold",
					children: "Low selling"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					columns: ["Product", "Sold"],
					isEmpty: data.lowSelling.length === 0,
					children: data.lowSelling.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
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
				})] })]
			})
		] })
	] });
}
//#endregion
export { AdminAnalyticsPage as component };
