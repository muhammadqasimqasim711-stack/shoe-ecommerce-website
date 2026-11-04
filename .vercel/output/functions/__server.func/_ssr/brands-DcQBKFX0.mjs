import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { st as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as SiteHeader, s as useBrands } from "./site-header-JEgEYlzV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands-DcQBKFX0.js
var import_jsx_runtime = require_jsx_runtime();
function BrandsPage() {
	const { data: brands = [], isLoading, isError } = useBrands();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10",
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
								"/ Brands"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-black tracking-tighter",
							children: "Shop by Brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mt-2",
							children: "Browse our curated roster of performance and lifestyle labels."
						})
					]
				}),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-6 text-sm text-amber-600",
					children: "Could not load brands. Start the backend on port 3001."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
					children: isLoading ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i)) : brands.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { brand: brand.name },
						className: "group rounded-2xl border border-border bg-card p-6 hover:border-accent transition flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl font-black tracking-tight",
							children: brand.name
						}), brand.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1 line-clamp-2",
							children: brand.description
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 text-accent" })]
					}, brand.id))
				})
			]
		})]
	});
}
//#endregion
export { BrandsPage as component };
