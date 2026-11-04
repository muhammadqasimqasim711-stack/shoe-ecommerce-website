import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { s as formatMoney, t as CUSTOMER_SEGMENTS } from "./staff-C5pUFFY_.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.segments-Bc5aHdAX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSegmentsPage() {
	const [segment, setSegment] = (0, import_react.useState)("vip");
	const { data: stats } = useQuery({
		queryKey: ["admin", "crm-stats"],
		queryFn: () => api.admin.crmStats()
	});
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"customers",
			"segment",
			segment
		],
		queryFn: () => api.admin.customers({
			segment,
			limit: 100
		})
	});
	const items = data?.items ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Customer segments",
		description: "Filter customers by engagement, lifecycle, and spend",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/crm",
				className: "rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted",
				children: "CRM Dashboard"
			}), CUSTOMER_SEGMENTS.map((s) => {
				const count = stats?.segments?.[s.value];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSegment(s.value),
					className: `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${segment === s.value ? "border-accent bg-accent text-accent-foreground shadow-sm" : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"}`,
					children: [s.label, typeof count === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1.5 rounded-full bg-background/40 px-1.5 py-0.5 text-[10px]",
						children: count
					})]
				}, s.value);
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		columns: [
			"Customer",
			"Orders",
			"Spent",
			"Last order",
			"Status"
		],
		loading: isLoading,
		isEmpty: items.length === 0,
		empty: `No customers in the “${segment}” segment.`,
		children: items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-b border-border/60 hover:bg-muted/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/customers/$id",
						params: { id: c.id },
						className: "text-accent hover:underline",
						children: c.name || c.email
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: c.totalOrders
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: formatMoney(c.totalSpending)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: c.lastOrder ? new Date(c.lastOrder.createdAt).toLocaleDateString() : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.accountStatus || (c.disabled ? "disabled" : "active") })
				})
			]
		}, c.id))
	})] });
}
//#endregion
export { AdminSegmentsPage as component };
