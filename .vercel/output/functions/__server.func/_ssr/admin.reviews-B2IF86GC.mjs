import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reviews-B2IF86GC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminReviewsPage() {
	const [filter, setFilter] = (0, import_react.useState)("");
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"reviews",
			filter
		],
		queryFn: () => api.admin.reviews({
			approved: filter || void 0,
			limit: 100
		})
	});
	const update = useMutation({
		mutationFn: ({ id, approved, hidden }) => api.admin.updateReview(id, {
			approved,
			hidden
		}),
		onSuccess: () => {
			toast.success("Review updated");
			queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: () => toast.error("Could not update review")
	});
	const remove = useMutation({
		mutationFn: () => api.admin.deleteReview(deleteId),
		onSuccess: () => {
			toast.success("Review deleted");
			setDeleteId(null);
			queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
		},
		onError: () => toast.error("Could not delete review")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reviews",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: filter,
				onChange: (e) => setFilter(e.target.value),
				className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "true",
						children: "Approved"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "false",
						children: "Pending"
					})
				]
			})
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "rounded-xl border border-border bg-background p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-semibold",
							children: [
								r.authorName,
								" · ",
								r.rating,
								"/5"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products/$id",
									params: { id: r.productId },
									className: "hover:text-accent",
									children: r.productName
								}),
								" ",
								"· ",
								new Date(r.createdAt).toLocaleDateString(),
								" ·",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.hidden ? "hidden" : r.approved ? "approved" : "pending" })
							]
						}),
						r.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: r.title
						}),
						r.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: r.comment
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							!r.approved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: update.isPending,
								onClick: () => update.mutate({
									id: r.id,
									approved: true,
									hidden: false
								}),
								children: "Approve"
							}),
							r.approved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: update.isPending,
								onClick: () => update.mutate({
									id: r.id,
									approved: false
								}),
								children: "Reject"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: update.isPending,
								onClick: () => update.mutate({
									id: r.id,
									hidden: !r.hidden
								}),
								children: r.hidden ? "Unhide" : "Hide"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "text-destructive",
								onClick: () => setDeleteId(r.id),
								children: "Delete"
							})
						]
					})]
				})
			}, r.id)), data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No reviews."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleteId,
			onOpenChange: (open) => !open && setDeleteId(null),
			title: "Delete this review?",
			description: "This cannot be undone.",
			confirmLabel: "Delete",
			destructive: true,
			loading: remove.isPending,
			onConfirm: () => remove.mutate()
		})
	] });
}
//#endregion
export { AdminReviewsPage as component };
