import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-to_MB67Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCategoriesPage() {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "categories"],
		queryFn: () => api.admin.categories()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [parentId, setParentId] = (0, import_react.useState)("");
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const create = useMutation({
		mutationFn: () => api.admin.createCategory({
			name: name.trim(),
			parentId: parentId || null
		}),
		onSuccess: () => {
			toast.success("Category created");
			setName("");
			setParentId("");
			queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
		},
		onError: () => toast.error("Could not create category")
	});
	const update = useMutation({
		mutationFn: () => api.admin.updateCategory(editing.id, {
			name: editing.name,
			parentId: editing.parentId,
			archived: editing.archived
		}),
		onSuccess: () => {
			toast.success("Category updated");
			setEditing(null);
			queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
		},
		onError: () => toast.error("Could not update category")
	});
	const remove = useMutation({
		mutationFn: () => api.admin.deleteCategory(deleteId),
		onSuccess: () => {
			toast.success("Category deleted");
			setDeleteId(null);
			queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
		},
		onError: () => toast.error("Could not delete category")
	});
	function flatten(nodes, depth = 0) {
		const out = [];
		for (const n of nodes) {
			out.push({
				...n,
				depth
			});
			if (n.children?.length) out.push(...flatten(n.children, depth + 1));
		}
		return out;
	}
	const flat = flatten(data);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Categories",
			description: "Organize your catalog"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-6 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-3",
			onSubmit: (e) => {
				e.preventDefault();
				if (name.trim()) create.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Category name",
					value: name,
					onChange: (e) => setName(e.target.value),
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: parentId,
					onChange: (e) => setParentId(e.target.value),
					className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "No parent"
					}), flat.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: c.id,
						children: ["— ".repeat(c.depth), c.name]
					}, c.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: create.isPending,
					children: "Add category"
				})
			]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [flat.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No categories yet."
			}), flat.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3",
				style: { marginLeft: c.depth * 16 },
				children: editing?.id === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "max-w-xs",
						value: editing.name,
						onChange: (e) => setEditing({
							...editing,
							name: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => update.mutate(),
						disabled: update.isPending,
						children: "Save"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setEditing(null),
						children: "Cancel"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								c.productCount,
								" products",
								c.archived ? " · archived" : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setEditing(c),
						children: "Edit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "text-destructive",
						onClick: () => setDeleteId(c.id),
						children: "Delete"
					})
				] })
			}, c.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleteId,
			onOpenChange: (open) => !open && setDeleteId(null),
			title: "Delete category?",
			description: "Products in this category will be unlinked.",
			confirmLabel: "Delete",
			destructive: true,
			loading: remove.isPending,
			onConfirm: () => remove.mutate()
		})
	] });
}
//#endregion
export { AdminCategoriesPage as component };
