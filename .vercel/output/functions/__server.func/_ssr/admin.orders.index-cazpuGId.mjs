import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { n as ORDER_STATUSES, s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Route } from "./admin.orders.index-DVA0zKZE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders.index-cazpuGId.js
var import_jsx_runtime = require_jsx_runtime();
function AdminOrdersPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const status = searchParams?.status ?? "";
	const search = searchParams?.search ?? "";
	const page = searchParams?.page ?? 1;
	const updateFilters = (patch) => {
		navigate({
			search: (prev) => {
				const next = {
					...prev,
					...patch
				};
				if (!next.status) delete next.status;
				if (!next.search) delete next.search;
				if (next.page === 1) delete next.page;
				return next;
			},
			replace: true
		});
	};
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"orders",
			status,
			search,
			page
		],
		queryFn: () => api.admin.orders({
			status: status || void 0,
			search: search || void 0,
			page,
			limit: 25
		}),
		placeholderData: (prev) => prev
	});
	const items = data?.items ?? [];
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 25;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: status === "Shipped" ? "Shipments" : "Orders",
			description: `${total} order${total === 1 ? "" : "s"}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search ID, email, tracking…",
					value: search,
					onChange: (e) => updateFilters({
						search: e.target.value,
						page: 1
					}),
					className: "max-w-xs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: status,
					onChange: (e) => updateFilters({
						status: e.target.value,
						page: 1
					}),
					className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All statuses"
					}), ORDER_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: s
					}, s))]
				}),
				(search || status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => updateFilters({
						search: "",
						status: "",
						page: 1
					}),
					className: "rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
					children: "Clear"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"Order",
				"Customer",
				"Status",
				"Payment",
				"Tracking",
				"Items",
				"Total",
				"Date"
			],
			loading: isLoading,
			isEmpty: items.length === 0,
			children: items.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
						children: o.user?.email ?? o.email ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: o.paymentStatus ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-muted-foreground",
						children: o.trackingNumber ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: o.itemCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: formatMoney(o.totalAmount, o.currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: new Date(o.createdAt).toLocaleDateString()
					})
				]
			}, o.id))
		}),
		totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground",
				children: [
					"Page ",
					page,
					" of ",
					totalPages
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-md border px-3 py-1 disabled:opacity-50",
					disabled: page <= 1,
					onClick: () => updateFilters({ page: Math.max(1, page - 1) }),
					children: "Previous"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-md border px-3 py-1 disabled:opacity-50",
					disabled: page >= totalPages,
					onClick: () => updateFilters({ page: page + 1 }),
					children: "Next"
				})]
			})]
		})
	] });
}
//#endregion
export { AdminOrdersPage as component };
