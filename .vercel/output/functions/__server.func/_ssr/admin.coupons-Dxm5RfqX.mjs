import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.coupons-Dxm5RfqX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	code: "",
	description: "",
	discountType: "percent",
	discountValue: "10",
	maxDiscount: "",
	usageLimit: "",
	minOrderValue: "",
	active: true
};
function AdminCouponsPage() {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "coupons"],
		queryFn: () => api.admin.coupons()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	function openCreate() {
		setEditing(null);
		setForm(emptyForm);
		setOpen(true);
	}
	function openEdit(c) {
		setEditing(c);
		setForm({
			code: c.code,
			description: c.description ?? "",
			discountType: c.discountType,
			discountValue: String(c.discountValue),
			maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : "",
			usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
			minOrderValue: c.minOrderValue != null ? String(c.minOrderValue) : "",
			active: c.active
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: () => {
			const payload = {
				code: form.code.trim(),
				description: form.description || void 0,
				discountType: form.discountType,
				discountValue: Number(form.discountValue),
				maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : void 0,
				usageLimit: form.usageLimit ? Number(form.usageLimit) : void 0,
				minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : void 0,
				active: form.active
			};
			if (editing) return api.admin.updateCoupon(editing.id, payload);
			return api.admin.createCoupon(payload);
		},
		onSuccess: () => {
			toast.success(editing ? "Coupon updated" : "Coupon created");
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
		},
		onError: () => toast.error("Could not save coupon")
	});
	const remove = useMutation({
		mutationFn: () => api.admin.deleteCoupon(deleteId),
		onSuccess: () => {
			toast.success("Coupon deleted");
			setDeleteId(null);
			queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
		},
		onError: () => toast.error("Could not delete coupon")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Coupons",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: openCreate,
				children: "Add coupon"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"Code",
				"Type",
				"Value",
				"Used",
				"Status",
				""
			],
			loading: isLoading,
			isEmpty: data.length === 0,
			children: data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/60 hover:bg-muted/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 font-medium",
						children: c.code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: c.discountType
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: c.discountType === "percent" ? `${c.discountValue}%` : c.discountValue
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "p-3",
						children: [c.usedCount ?? 0, c.usageLimit != null ? ` / ${c.usageLimit}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.active ? "active" : "disabled" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => openEdit(c),
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "text-destructive",
								onClick: () => setDeleteId(c.id),
								children: "Delete"
							})]
						})
					})
				]
			}, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit coupon" : "New coupon" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.code,
								onChange: (e) => setForm({
									...form,
									code: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.discountType,
									onChange: (e) => setForm({
										...form,
										discountType: e.target.value
									}),
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "percent",
											children: "Percent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fixed",
											children: "Fixed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "free_shipping",
											children: "Free shipping"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: form.discountValue,
									onChange: (e) => setForm({
										...form,
										discountValue: e.target.value
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Usage limit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: form.usageLimit,
									onChange: (e) => setForm({
										...form,
										usageLimit: e.target.value
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Min order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: form.minOrderValue,
									onChange: (e) => setForm({
										...form,
										minOrderValue: e.target.value
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (v) => setForm({
									...form,
									active: v
								})
							}), "Active"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !form.code.trim() || save.isPending,
					onClick: () => save.mutate(),
					children: "Save"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleteId,
			onOpenChange: (open) => !open && setDeleteId(null),
			title: "Delete coupon?",
			confirmLabel: "Delete",
			destructive: true,
			loading: remove.isPending,
			onConfirm: () => remove.mutate()
		})
	] });
}
//#endregion
export { AdminCouponsPage as component };
