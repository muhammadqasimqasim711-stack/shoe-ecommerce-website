import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./blog._slug-DZxYWt2f.mjs";
import { n as SiteHeader } from "./site-header-yEx0p83x.mjs";
import { t as SiteFooter } from "./site-footer-k10DHO6V.mjs";
import { t as CmsHtml } from "./cms-html-RzYu_O3M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-JWHawZOF.js
var import_jsx_runtime = require_jsx_runtime();
function BlogPostPage() {
	const { slug } = Route.useParams();
	const { data: post, isLoading, isError } = useQuery({
		queryKey: [
			"cms",
			"blog",
			slug
		],
		queryFn: () => api.getCmsBlogPost(slug)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/blog",
					className: "text-xs text-accent hover:underline",
					children: "← Journal"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-64 rounded-xl" }) : isError || !post ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8",
					children: "Post not found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-accent",
							children: post.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-4xl font-black tracking-tighter",
							children: post.title
						}),
						post.authorName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: ["By ", post.authorName]
						}),
						post.featuredImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: post.featuredImageUrl,
							alt: "",
							className: "my-6 w-full rounded-2xl"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsHtml, {
							html: post.content,
							className: "prose max-w-none text-muted-foreground leading-relaxed"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { BlogPostPage as component };
