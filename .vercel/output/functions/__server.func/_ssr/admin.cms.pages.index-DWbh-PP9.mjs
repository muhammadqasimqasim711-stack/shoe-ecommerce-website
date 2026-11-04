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
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.pages.index-DWbh-PP9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsPagesIndex() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const { data, isLoading } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"pages",
			search,
			status
		],
		queryFn: () => api.admin.cms.pages({
			search: search || void 0,
			status: status || void 0,
			limit: 100
		})
	});
	const items = data?.items ?? [];
	const publish = useMutation({
		mutationFn: ({ id, on }) => on ? api.admin.cms.publishPage(id) : api.admin.cms.unpublishPage(id),
		onSuccess: () => {
			toast.success("Page status updated");
			qc.invalidateQueries({ queryKey: ["admin", "cms"] });
		},
		onError: () => toast.error("Could not update page")
	});
	const remove = useMutation({
		mutationFn: () => api.admin.cms.deletePage(deleteId),
		onSuccess: () => {
			toast.success("Page deleted");
			setDeleteId(null);
			qc.invalidateQueries({ queryKey: ["admin", "cms"] });
		},
		onError: () => toast.error("Could not delete page")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Pages",
			description: "About, legal, help, and custom pages",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/cms/pages/new",
					children: "Add page"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: "Search",
				className: "h-10 rounded-md border border-input bg-background px-3 text-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: status,
				onChange: (e) => setStatus(e.target.value),
				className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All statuses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "DRAFT",
						children: "Draft"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "PUBLISHED",
						children: "Published"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "SCHEDULED",
						children: "Scheduled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "ARCHIVED",
						children: "Archived"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"Title",
				"Slug",
				"Type",
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
						children: p.type
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/cms/pages/$id",
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
			title: "Delete this page?",
			description: "This cannot be undone.",
			destructive: true,
			loading: remove.isPending,
			onConfirm: () => remove.mutate()
		})
	] });
}
//#endregion
export { CmsPagesIndex as component };
