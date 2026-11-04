import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Star } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as objectType, n as enumType, o as preprocessType, r as literalType, s as stringType } from "../_libs/zod.mjs";
import { c as useFlyCart, l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { c as useCart, h as useShopProducts, l as useCategories, n as SiteHeader, s as useBrands } from "./site-header-yEx0p83x.mjs";
import { t as ProductImage } from "./product-image-ClW4tcdv.mjs";
import { t as WishlistButton } from "./wishlist-button-ByJ8nQQr.mjs";
import { n as shopTitle, t as Route } from "./shop-BfIDfpTA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-C2UprQAE.js
var import_jsx_runtime = require_jsx_runtime();
function optionalOnSale(value) {
	if (value === true || value === "true" || value === 1 || value === "1") return "true";
}
function optionalDays(value) {
	if (value == null || value === "") return void 0;
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n) || n < 1) return void 0;
	return String(Math.trunc(n));
}
objectType({
	gender: enumType([
		"men",
		"women",
		"kids",
		"unisex"
	]).optional(),
	onSale: preprocessType(optionalOnSale, literalType("true").optional()),
	sort: enumType([
		"newest",
		"price_asc",
		"price_desc",
		"trending"
	]).optional(),
	days: preprocessType(optionalDays, stringType().optional()),
	brand: stringType().optional(),
	category: stringType().optional(),
	search: stringType().optional(),
	collection: stringType().optional()
});
function ShopPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/shop" });
	const { data: products = [], isPending, isError, isFetching } = useShopProducts(search);
	const { data: brands = [] } = useBrands();
	const { data: categories = [] } = useCategories();
	const { addItem } = useCart();
	const { flyToCart } = useFlyCart();
	const { t, formatMoney } = useLocale();
	const showSkeleton = isPending && products.length === 0;
	const categoryName = categories.find((c) => c.id === search.category || c.name.toLowerCase() === search.category?.toLowerCase())?.name;
	const title = shopTitle(search, categoryName);
	const updateSearch = (patch) => {
		const next = {
			...search,
			...patch
		};
		Object.keys(next).forEach((key) => {
			if (next[key] === void 0 || next[key] === "" || next[key] === "all") delete next[key];
		});
		navigate({ search: next });
	};
	const clearFilters = () => {
		navigate({ search: {} });
	};
	const hasFilters = Boolean(search.gender || search.category || search.brand || search.onSale || search.sort || search.days || search.search || search.collection);
	const handleQuickAdd = async (product, clickEvent) => {
		if (clickEvent) flyToCart(clickEvent, product.img);
		if (!product.defaultVariantId) {
			toast.error("This product is not available yet.");
			return;
		}
		try {
			await addItem.mutateAsync(product.defaultVariantId);
			toast.success(`${product.name} added to cart`);
		} catch {
			toast.error("Could not add to cart. Is the backend running?");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { search: search.search ?? "" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "hover:underline",
									children: "Home"
								}),
								" ",
								"/ Shop"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-black tracking-tighter",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-2",
							children: showSkeleton ? "Loading…" : `${products.length} product${products.length === 1 ? "" : "s"}${isFetching ? " · updating" : ""}`
						})
					] }), hasFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "rounded-full",
						onClick: clearFilters,
						children: "Clear filters"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-wrap gap-3 items-center border border-border rounded-2xl bg-muted/30 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Gender"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 rounded-full border border-border bg-background px-3 text-sm",
							value: search.gender ?? "all",
							onChange: (e) => updateSearch({ gender: e.target.value === "all" ? void 0 : e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "men",
									children: "Men"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "women",
									children: "Women"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "kids",
									children: "Kids"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 rounded-full border border-border bg-background px-3 text-sm",
							value: search.category ?? "all",
							onChange: (e) => updateSearch({ category: e.target.value === "all" ? void 0 : e.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All"
							}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2",
							children: "Brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 rounded-full border border-border bg-background px-3 text-sm",
							value: search.brand ?? "all",
							onChange: (e) => updateSearch({ brand: e.target.value === "all" ? void 0 : e.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All"
							}), brands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: b.name,
								children: b.name
							}, b.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex items-center gap-2 text-sm ml-2 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "h-4 w-4 accent-[var(--accent)]",
								checked: search.onSale === "true",
								onChange: (e) => updateSearch({ onSale: e.target.checked ? "true" : void 0 })
							}), "On sale"]
						})
					]
				}),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-6 text-sm text-amber-600",
					children: "Could not load products. Start the backend on port 3001."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
					children: showSkeleton ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square rounded-2xl mb-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-2/3 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/3" })
					] }, i)) : products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "group flex flex-col justify-between h-full bg-card/60 rounded-2xl p-3 border border-border/60 hover:border-accent transition-all shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-xl bg-muted aspect-square mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products/$id",
									params: { id: p.id },
									className: "block h-full w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
										src: p.img,
										alt: p.name,
										loading: "lazy",
										className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									})
								}),
								p.tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: `absolute top-3 left-3 z-10 max-w-[calc(100%-3.5rem)] truncate rounded-full px-3 ${p.tag.startsWith("-") ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`,
									children: p.tag
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistButton, {
									product: p,
									className: "absolute top-3 right-3 z-10"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: addItem.isPending,
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
										handleQuickAdd(p, e);
									},
									className: "absolute bottom-3 left-3 right-3 z-10 h-9 sm:h-10 px-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-accent disabled:opacity-50",
									children: t("quickAdd")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/products/$id",
							params: { id: p.id },
							className: "block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground uppercase tracking-wider truncate",
											children: p.brand
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold mt-1 line-clamp-1",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 mt-1 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-accent text-accent" }),
												" ",
												p.rating,
												" (",
												p.reviewCount,
												")"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "shrink-0 text-right ml-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: formatMoney(p.price, { round: true })
									}), p.oldPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground line-through",
										children: formatMoney(p.oldPrice, { round: true })
									})]
								})]
							})
						})] })
					}, p.id))
				}),
				!showSkeleton && !isError && products.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground py-16 text-center",
					children: "No products match this filter."
				})
			]
		})]
	});
}
//#endregion
export { ShopPage as component };
