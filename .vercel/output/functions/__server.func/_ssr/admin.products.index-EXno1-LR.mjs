import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { E as Pencil, K as Ellipsis, X as Copy, d as Trash2, lt as Archive, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { r as PRODUCT_STATUSES, s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
import { t as Route } from "./admin.products.index-hjDPobRr.mjs";
import { a as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-lm0fXf4o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.index-EXno1-LR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProductsPage() {
	const queryClient = useQueryClient();
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const search = searchParams?.search ?? "";
	const status = searchParams?.status ?? "";
	const sort = searchParams?.sort ?? "updated_desc";
	const page = searchParams?.page ?? 1;
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	const updateFilters = (patch) => {
		navigate({
			search: (prev) => {
				const next = {
					...prev,
					...patch
				};
				if (!next.search) delete next.search;
				if (!next.status) delete next.status;
				if (!next.sort || next.sort === "updated_desc") delete next.sort;
				if (next.page === 1) delete next.page;
				return next;
			},
			replace: true
		});
	};
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"products",
			search,
			status,
			sort,
			page
		],
		queryFn: () => api.admin.products({
			search: search || void 0,
			status: status || void 0,
			sort,
			page,
			limit: 20
		}),
		placeholderData: (prev) => prev
	});
	const items = data?.items ?? [];
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 20;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const action = useMutation({
		mutationFn: async () => {
			if (!confirm) return;
			if (confirm.action === "archive") return api.admin.archiveProduct(confirm.id);
			if (confirm.action === "restore") return api.admin.restoreProduct(confirm.id);
			return api.admin.deleteProduct(confirm.id);
		},
		onSuccess: () => {
			toast.success(confirm?.action === "delete" ? "Product deleted" : confirm?.action === "restore" ? "Product restored" : "Product archived");
			setConfirm(null);
			queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: () => toast.error("Action failed")
	});
	const duplicate = useMutation({
		mutationFn: (id) => api.admin.duplicateProduct(id),
		onSuccess: () => {
			toast.success("Product duplicated");
			queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
		},
		onError: () => toast.error("Could not duplicate")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Products",
			description: `${total} product${total === 1 ? "" : "s"}`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/products/new",
					children: "Add product"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search name or SKU…",
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
					}), PRODUCT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: s.replaceAll("_", " ")
					}, s))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: sort,
					onChange: (e) => updateFilters({ sort: e.target.value }),
					className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "updated_desc",
							children: "Recently updated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "name_asc",
							children: "Name A–Z"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "name_desc",
							children: "Name Z–A"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price_asc",
							children: "Price ↑"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price_desc",
							children: "Price ↓"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "created_desc",
							children: "Newest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "created_asc",
							children: "Oldest"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"",
				"Product",
				"SKU",
				"Category",
				"Price",
				"Sale",
				"Stock",
				"Status",
				""
			],
			loading: isLoading,
			isEmpty: items.length === 0,
			empty: "No products found.",
			children: items.map((p) => {
				const img = p.image || p.img;
				const cats = (p.categoryNames ?? p.categories ?? []).join(", ") || "—";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/60 hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img,
								alt: "",
								className: "h-10 w-10 rounded object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 rounded bg-muted" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/products/$id",
								params: { id: p.id },
								className: "font-medium text-accent hover:underline",
								children: p.name
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: p.sku ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 max-w-[140px] truncate",
							children: cats
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: formatMoney(p.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: p.compareAtPrice != null && p.compareAtPrice > p.price ? formatMoney(p.compareAtPrice) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: p.stockTotal
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/admin/products/$id",
											params: { id: p.id },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => duplicate.mutate(p.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), " Duplicate"]
									}),
									p.rawStatus === "ARCHIVED" || p.status === "ARCHIVED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setConfirm({
											id: p.id,
											action: "restore"
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-2 h-4 w-4" }), " Restore"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setConfirm({
											id: p.id,
											action: "archive"
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-2 h-4 w-4" }), " Archive"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										className: "text-destructive",
										onClick: () => setConfirm({
											id: p.id,
											action: "delete"
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete"]
									})
								]
							})] })
						})
					]
				}, p.id);
			})
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					disabled: page <= 1,
					onClick: () => updateFilters({ page: Math.max(1, page - 1) }),
					children: "Previous"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					disabled: page >= totalPages,
					onClick: () => updateFilters({ page: page + 1 }),
					children: "Next"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!confirm,
			onOpenChange: (open) => !open && setConfirm(null),
			title: confirm?.action === "delete" ? "Delete product permanently?" : confirm?.action === "restore" ? "Restore this product?" : "Archive this product?",
			description: confirm?.action === "delete" ? "This cannot be undone." : confirm?.action === "restore" ? "The product will become available again." : "It will be hidden from the storefront.",
			confirmLabel: confirm?.action === "delete" ? "Delete" : confirm?.action === "restore" ? "Restore" : "Archive",
			destructive: confirm?.action === "delete" || confirm?.action === "archive",
			loading: action.isPending,
			onConfirm: () => action.mutate()
		})
	] });
}
//#endregion
export { AdminProductsPage as component };
