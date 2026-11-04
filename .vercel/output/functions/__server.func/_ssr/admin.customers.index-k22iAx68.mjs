import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { F as LayoutDashboard, S as Search, U as Funnel, q as Download } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { s as formatMoney, t as CUSTOMER_SEGMENTS } from "./staff-C5pUFFY_.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./admin.customers.index-EUn5OWQ9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers.index-k22iAx68.js
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomersPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const search = searchParams?.search ?? "";
	const segment = searchParams?.segment ?? "";
	const page = searchParams?.page ?? 1;
	const updateFilters = (patch) => {
		navigate({
			search: (prev) => {
				const next = {
					...prev,
					...patch
				};
				if (!next.search) delete next.search;
				if (!next.segment) delete next.segment;
				if (next.page === 1) delete next.page;
				return next;
			},
			replace: true
		});
	};
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"customers",
			search,
			segment,
			page
		],
		queryFn: () => api.admin.customers({
			search: search || void 0,
			segment: segment || void 0,
			page,
			limit: 25
		}),
		placeholderData: (prev) => prev
	});
	const items = data?.items ?? [];
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 25;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const exportCsv = () => {
		if (items.length === 0) {
			toast.error("No customer records to export");
			return;
		}
		const headers = [
			"ID",
			"Name",
			"Email",
			"Phone",
			"Orders",
			"Total Spent",
			"Last Order",
			"Segments",
			"Status"
		];
		const rows = items.map((c) => [
			c.id,
			`"${(c.name || "").replace(/"/g, "\"\"")}"`,
			`"${c.email.replace(/"/g, "\"\"")}"`,
			`"${(c.phone || "").replace(/"/g, "\"\"")}"`,
			c.totalOrders,
			c.totalSpending,
			c.lastOrder ? new Date(c.lastOrder.createdAt).toLocaleDateString() : "",
			`"${(c.segments ?? []).join(", ")}"`,
			c.accountStatus || (c.disabled ? "disabled" : "active")
		]);
		const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `customers-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success(`Exported ${items.length} customers to CSV`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Customer Directory",
				description: `${total} customer account${total === 1 ? "" : "s"} registered`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/crm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "mr-1.5 h-4 w-4" }), " CRM Dashboard"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/segments",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mr-1.5 h-4 w-4" }), " Segments"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: exportCsv,
							disabled: items.length === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), " Export CSV"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search email, name, phone…",
							value: search,
							onChange: (e) => updateFilters({
								search: e.target.value,
								page: 1
							}),
							className: "pl-9 text-xs"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: segment,
						onChange: (e) => updateFilters({
							segment: e.target.value,
							page: 1
						}),
						className: "h-9 rounded-md border border-input bg-background px-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All Segments"
						}), CUSTOMER_SEGMENTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.value,
							children: s.label
						}, s.value))]
					}),
					(search || segment) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "text-xs h-9",
						onClick: () => updateFilters({
							search: "",
							segment: "",
							page: 1
						}),
						children: "Clear Filters"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns: [
					"Customer",
					"Phone",
					"Orders",
					"Spent",
					"Last order",
					"Segments",
					"Status",
					"Actions"
				],
				loading: isLoading,
				isEmpty: items.length === 0,
				children: items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/60 hover:bg-muted/40 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/customers/$id",
								params: { id: c.id },
								className: "font-semibold text-foreground hover:text-accent hover:underline block",
								children: c.name || c.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: c.email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: c.phone ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 font-medium",
							children: c.totalOrders
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 font-bold text-accent",
							children: formatMoney(c.totalSpending)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: c.lastOrder ? new Date(c.lastOrder.createdAt).toLocaleDateString() : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: (c.segments ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "—"
								}) : (c.segments ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent",
									children: s
								}, s))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.accountStatus || (c.disabled ? "disabled" : "active") })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "ghost",
								className: "h-7 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/customers/$id",
									params: { id: c.id },
									children: "Profile"
								})
							})
						})
					]
				}, c.id))
			}),
			totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between text-xs",
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page <= 1,
						onClick: () => updateFilters({ page: Math.max(1, page - 1) }),
						className: "text-xs h-8",
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page >= totalPages,
						onClick: () => updateFilters({ page: page + 1 }),
						className: "text-xs h-8",
						children: "Next"
					})]
				})]
			})
		]
	});
}
//#endregion
export { AdminCustomersPage as component };
