import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.refunds-BMTnCmu_.js
var import_jsx_runtime = require_jsx_runtime();
function AdminRefundsPage() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "refunds"],
		queryFn: () => api.admin.refunds(100)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Refunds",
		description: `${data.length} records`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		columns: [
			"Refund",
			"Order",
			"Amount",
			"Status",
			"Date"
		],
		loading: isLoading,
		isEmpty: data.length === 0,
		empty: "No refunds yet.",
		children: data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-b border-border/60 hover:bg-muted/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
					className: "p-3",
					children: [r.id.slice(0, 8), "…"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/orders/$id",
						params: { id: r.orderId },
						className: "text-accent hover:underline",
						children: [r.orderId.slice(0, 8), "…"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: formatMoney(r.amount)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: new Date(r.createdAt).toLocaleDateString()
				})
			]
		}, r.id))
	})] });
}
//#endregion
export { AdminRefundsPage as component };
