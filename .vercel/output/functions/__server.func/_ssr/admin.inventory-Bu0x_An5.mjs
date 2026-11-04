import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
import { t as Route } from "./admin.inventory-D6X_YLBH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-Bu0x_An5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminInventoryPage() {
	const queryClient = useQueryClient();
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const search = searchParams?.search ?? "";
	const lowStock = !!searchParams?.lowStock;
	const page = searchParams?.page ?? 1;
	const updateFilters = (patch) => {
		navigate({
			search: (prev) => {
				const next = {
					...prev,
					...patch
				};
				if (!next.search) delete next.search;
				if (!next.lowStock) delete next.lowStock;
				if (next.page === 1) delete next.page;
				return next;
			},
			replace: true
		});
	};
	const [adjusting, setAdjusting] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("set");
	const [quantity, setQuantity] = (0, import_react.useState)("0");
	const [reason, setReason] = (0, import_react.useState)("");
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"inventory",
			search,
			lowStock,
			page
		],
		queryFn: () => api.admin.inventory({
			search: search || void 0,
			lowStock: lowStock ? "true" : void 0,
			page,
			limit: 50
		}),
		placeholderData: (prev) => prev
	});
	const items = data?.items ?? [];
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 50;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const adjust = useMutation({
		mutationFn: () => api.admin.adjustStock(adjusting.id, {
			mode,
			quantity: Number(quantity),
			reason: reason.trim()
		}),
		onSuccess: () => {
			toast.success("Stock updated");
			setAdjusting(null);
			setReason("");
			queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: () => toast.error("Could not adjust stock")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Inventory",
			description: `${total} variants`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search product or SKU…",
				value: search,
				onChange: (e) => updateFilters({
					search: e.target.value,
					page: 1
				}),
				className: "max-w-xs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: lowStock,
					onChange: (e) => updateFilters({
						lowStock: e.target.checked,
						page: 1
					})
				}), "Low stock only"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"Product",
				"SKU",
				"Size",
				"Color",
				"Stock",
				"Reserved",
				"Available",
				""
			],
			loading: isLoading,
			isEmpty: items.length === 0,
			children: items.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: `border-b border-border/60 hover:bg-muted/40 ${row.lowStock ? "bg-amber-50/50" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/products/$id",
							params: { id: row.productId },
							className: "text-accent hover:underline",
							children: row.productName
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-muted-foreground",
						children: row.sku ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: row.size ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: row.color ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 font-medium",
						children: row.stock
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: row.reservedStock
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: row.available
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								setAdjusting({
									id: row.id,
									productName: row.productName,
									stock: row.stock
								});
								setQuantity(String(row.stock));
								setMode("set");
							},
							children: "Adjust"
						})
					})
				]
			}, row.id))
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!adjusting,
			onOpenChange: (open) => !open && setAdjusting(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Adjust stock — ", adjusting?.productName] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["Current stock: ", adjusting?.stock]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: mode,
								onChange: (e) => setMode(e.target.value),
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "set",
										children: "Set exact"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "increase",
										children: "Increase by"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "decrease",
										children: "Decrease by"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: quantity,
								onChange: (e) => setQuantity(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: reason,
								onChange: (e) => setReason(e.target.value),
								required: true
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setAdjusting(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !reason.trim() || adjust.isPending,
					onClick: () => adjust.mutate(),
					children: adjust.isPending ? "Saving…" : "Apply"
				})] })
			] })
		})
	] });
}
//#endregion
export { AdminInventoryPage as component };
