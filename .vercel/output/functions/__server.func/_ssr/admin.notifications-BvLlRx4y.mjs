import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.notifications-BvLlRx4y.js
var import_jsx_runtime = require_jsx_runtime();
function AdminNotificationsPage() {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "notifications"],
		queryFn: () => api.admin.notifications(50)
	});
	const markRead = useMutation({
		mutationFn: (id) => api.admin.markNotificationRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
		}
	});
	const markAll = useMutation({
		mutationFn: () => api.admin.markAllNotificationsRead(),
		onSuccess: () => {
			toast.success("All notifications marked read");
			queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
		},
		onError: () => toast.error("Could not mark all read")
	});
	const unread = data.filter((n) => !n.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications",
		description: unread ? `${unread} unread` : "You're all caught up",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			disabled: !unread || markAll.isPending,
			onClick: () => markAll.mutate(),
			children: "Mark all read"
		})
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No notifications."
		}), data.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: `rounded-xl border border-border p-4 ${n.read ? "bg-background" : "bg-accent/5 border-accent/30"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium text-sm",
						children: n.title
					}),
					n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: n.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: new Date(n.createdAt).toLocaleString()
					}),
					n.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.link,
						className: "mt-2 inline-block text-xs text-accent hover:underline",
						children: "Open"
					})
				] }), !n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => markRead.mutate(n.id),
					children: "Mark read"
				})]
			})
		}, n.id))]
	})] });
}
//#endregion
export { AdminNotificationsPage as component };
