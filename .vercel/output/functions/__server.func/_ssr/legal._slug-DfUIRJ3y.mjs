import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as SiteHeader } from "./site-header-yEx0p83x.mjs";
import { t as SiteFooter } from "./site-footer-k10DHO6V.mjs";
import { t as CmsHtml } from "./cms-html-RzYu_O3M.mjs";
import { t as Route } from "./legal._slug-BGu8tHc_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal._slug-DfUIRJ3y.js
var import_jsx_runtime = require_jsx_runtime();
function LegalSlugPage() {
	const { slug } = Route.useParams();
	const { data: page, isLoading, isError } = useQuery({
		queryKey: [
			"cms",
			"page",
			slug
		],
		queryFn: () => api.getCmsPage(slug),
		staleTime: 6e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:underline",
							children: "Home"
						}),
						" ",
						"/ Legal / ",
						page?.title ?? slug
					]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-2/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })]
				}) : isError || !page ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black tracking-tighter mb-3",
						children: "Page not found"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Back home"
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl md:text-5xl font-black tracking-tighter mb-8",
					children: page.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsHtml, {
					html: page.content,
					className: "prose-sole text-muted-foreground leading-relaxed"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { LegalSlugPage as component };
