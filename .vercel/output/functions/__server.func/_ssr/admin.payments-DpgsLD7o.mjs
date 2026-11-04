import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.payments-DpgsLD7o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPaymentsPage() {
	const [status, setStatus] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"payments",
			status,
			page
		],
		queryFn: () => api.admin.payments({
			status: status || void 0,
			page,
			limit: 25
		})
	});
	const items = data?.items ?? [];
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 25;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Transactions",
			description: `${total} payment${total === 1 ? "" : "s"}`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: status,
				onChange: (e) => {
					setStatus(e.target.value);
					setPage(1);
				},
				className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All statuses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "Paid",
						children: "Paid"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "Pending",
						children: "Pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "Failed",
						children: "Failed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "Refunded",
						children: "Refunded"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"Payment",
				"Order",
				"Provider",
				"Amount",
				"Status",
				"Date"
			],
			loading: isLoading,
			isEmpty: items.length === 0,
			children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/60 hover:bg-muted/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "p-3",
						children: [p.id.slice(0, 8), "…"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/orders/$id",
							params: { id: p.orderId },
							className: "text-accent hover:underline",
							children: [p.orderId.slice(0, 8), "…"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: p.provider
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: formatMoney(p.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: new Date(p.createdAt).toLocaleDateString()
					})
				]
			}, p.id))
		}),
		totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex justify-end gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "rounded-md border px-3 py-1 disabled:opacity-50",
				disabled: page <= 1,
				onClick: () => setPage((p) => p - 1),
				children: "Previous"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "rounded-md border px-3 py-1 disabled:opacity-50",
				disabled: page >= totalPages,
				onClick: () => setPage((p) => p + 1),
				children: "Next"
			})]
		})
	] });
}
//#endregion
export { AdminPaymentsPage as component };
