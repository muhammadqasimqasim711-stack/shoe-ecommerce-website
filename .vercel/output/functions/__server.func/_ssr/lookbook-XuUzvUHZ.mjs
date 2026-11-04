import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { st as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { n as SiteHeader } from "./site-header-yEx0p83x.mjs";
import { t as ProductImage } from "./product-image-ClW4tcdv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lookbook-XuUzvUHZ.js
var import_jsx_runtime = require_jsx_runtime();
function LookbookPage() {
	const { formatMoney } = useLocale();
	const { data: products = [], isLoading, isError } = useQuery({
		queryKey: [
			"products",
			"lookbook",
			"summer-26"
		],
		queryFn: () => api.getProducts({
			collection: "summer-26",
			limit: 100
		}),
		staleTime: 6e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative overflow-hidden bg-[oklch(0.08_0_0)] text-white px-4 py-16 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-accent font-semibold mb-3",
						children: "Lookbook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-5xl md:text-7xl font-black tracking-tighter mb-4",
						children: ["Summer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-accent",
							children: "'26"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-white/60 max-w-xl mb-8",
						children: "A curated edit of performance and lifestyle silhouettes for the season ahead."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop",
							search: { collection: "summer-26" },
							children: ["Shop the collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
						})
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-12 md:py-16",
			children: [
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-amber-600 mb-6",
					children: "Could not load lookbook. Is the backend running?"
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-2 gap-8",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[4/5] rounded-2xl" }, i))
				}) : products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-center py-16",
					children: "No looks in this collection yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-2 gap-8 md:gap-10",
					children: products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: `group ${i % 3 === 0 ? "md:col-span-2" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products/$id",
							params: { id: p.id },
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `relative overflow-hidden rounded-2xl bg-muted ${i % 3 === 0 ? "aspect-[21/9] md:aspect-[2.4/1]" : "aspect-[4/5]"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
									src: p.img,
									alt: p.name,
									className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-end justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: p.brand
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-black tracking-tight",
									children: p.name
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold",
									children: formatMoney(p.price, { round: true })
								})]
							})]
						})
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { collection: "summer-26" },
							children: "Shop Summer '26"
						})
					})
				})
			]
		})] })]
	});
}
//#endregion
export { LookbookPage as component };
