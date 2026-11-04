import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.index-f2uBhfnj.js
var import_jsx_runtime = require_jsx_runtime();
function CmsDashboardPage() {
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"dashboard"
		],
		queryFn: () => api.admin.cms.dashboard()
	});
	const cards = data ? [
		{
			label: "Published pages",
			value: data.publishedPages,
			to: "/admin/cms/pages"
		},
		{
			label: "Draft pages",
			value: data.draftPages,
			to: "/admin/cms/pages"
		},
		{
			label: "Active banners",
			value: data.activeBanners,
			to: "/admin/cms/banners"
		},
		{
			label: "Categories",
			value: data.categories,
			to: "/admin/categories"
		},
		{
			label: "Blog posts",
			value: data.blogPosts,
			to: "/admin/cms/blog"
		},
		{
			label: "Media files",
			value: data.mediaFiles,
			to: "/admin/cms/media"
		}
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "CMS",
			description: "Manage storefront content without changing code"
		}),
		isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-amber-600",
			children: "Could not load CMS stats."
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: c.to,
				className: "rounded-xl border border-border bg-background p-5 hover:border-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-xs uppercase tracking-wider text-muted-foreground",
					children: c.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-bold",
					children: c.value
				})]
			}, c.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 font-semibold",
			children: "Recent content changes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [(data?.recentChanges ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-2 text-xs uppercase text-muted-foreground",
					children: row.entity
				}), row.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status })]
			}, `${row.entity}-${row.id}`)), !isLoading && !data?.recentChanges.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No recent CMS edits yet."
			})]
		})
	] });
}
//#endregion
export { CmsDashboardPage as component };
