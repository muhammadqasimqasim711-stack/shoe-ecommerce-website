import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.blog.index-DvFoJHGE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsBlogIndex() {
	const qc = useQueryClient();
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"blog"
		],
		queryFn: () => api.admin.cms.blog({ limit: 100 })
	});
	const items = data?.items ?? [];
	const publish = useMutation({
		mutationFn: ({ id, on }) => on ? api.admin.cms.publishBlog(id) : api.admin.cms.unpublishBlog(id),
		onSuccess: () => {
			toast.success("Post updated");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"blog"
			] });
		}
	});
	const remove = useMutation({
		mutationFn: () => api.admin.cms.deleteBlog(deleteId),
		onSuccess: () => {
			toast.success("Post deleted");
			setDeleteId(null);
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"blog"
			] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Blog",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/cms/blog/new",
					children: "Add post"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"Title",
				"Slug",
				"Status",
				"Actions"
			],
			loading: isLoading,
			isEmpty: !items.length,
			children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 font-medium",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-muted-foreground",
						children: p.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/cms/blog/$id",
										params: { id: p.id },
										children: "Edit"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => publish.mutate({
										id: p.id,
										on: p.status !== "PUBLISHED"
									}),
									children: p.status === "PUBLISHED" ? "Unpublish" : "Publish"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "destructive",
									onClick: () => setDeleteId(p.id),
									children: "Delete"
								})
							]
						})
					})
				]
			}, p.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: Boolean(deleteId),
			onOpenChange: (o) => !o && setDeleteId(null),
			title: "Delete this post?",
			destructive: true,
			loading: remove.isPending,
			onConfirm: () => remove.mutate()
		})
	] });
}
//#endregion
export { CmsBlogIndex as component };
