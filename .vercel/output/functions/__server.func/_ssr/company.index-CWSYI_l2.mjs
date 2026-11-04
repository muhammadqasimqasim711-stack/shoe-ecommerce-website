import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { st as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as SiteHeader } from "./site-header-yEx0p83x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.index-CWSYI_l2.js
var import_jsx_runtime = require_jsx_runtime();
var COMPANY_ORDER = [
	"about",
	"careers",
	"press",
	"sustainability",
	"stores"
];
function CompanyHubPage() {
	const { data: pages = [], isLoading, isError } = useQuery({
		queryKey: ["cms", "pages"],
		queryFn: () => api.getCmsPages(),
		staleTime: 6e4
	});
	const companyPages = COMPANY_ORDER.map((slug) => pages.find((p) => p.slug === slug)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:underline",
							children: "Home"
						}),
						" ",
						"/ Company"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl md:text-5xl font-black tracking-tighter mb-3",
					children: "Company"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mb-10",
					children: "Our story, open roles, press, sustainability, and where to find us."
				}),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-amber-600 mb-6",
					children: "Could not load pages. Is the backend running?"
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 rounded-2xl" }, i))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: companyPages.map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/company/$slug",
						params: { slug: page.slug },
						className: "flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 hover:border-accent transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: page.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-accent" })]
					}) }, page.slug))
				})
			]
		})]
	});
}
//#endregion
export { CompanyHubPage as component };
