import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { B as Heart, d as Trash2, h as Star } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useFlyCart, l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { c as useCart, g as useWishlist, n as SiteHeader } from "./site-header-yEx0p83x.mjs";
import { t as ProductImage } from "./product-image-ClW4tcdv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-BWsicsRK.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const { items, itemCount, isLoading, removeItem } = useWishlist();
	const { addItem } = useCart();
	const { flyToCart } = useFlyCart();
	const { t, formatMoney } = useLocale();
	const handleRemove = async (itemId, name) => {
		try {
			await removeItem.mutateAsync(itemId);
			toast.success(`${name} removed from wishlist`);
		} catch {
			toast.error("Could not remove item.");
		}
	};
	const handleAddToCart = async (variantId, name, imgUrl, clickEvent) => {
		if (clickEvent) flyToCart(clickEvent, imgUrl);
		if (!variantId) {
			toast.error("This product is not available yet.");
			return;
		}
		try {
			await addItem.mutateAsync(variantId);
			toast.success(`${name} added to cart`);
		} catch {
			toast.error("Could not add to cart.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { showSearch: false }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-4 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							"/ Wishlist"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl md:text-5xl font-black tracking-tighter",
						children: "Wishlist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-2",
						children: isLoading && items.length === 0 ? "Loading your saved products…" : `${itemCount} saved product${itemCount === 1 ? "" : "s"}`
					})
				]
			}), isLoading && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square rounded-2xl mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-2/3 mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/3" })
				] }, i))
			}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight mb-2",
						children: "No saved products yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mb-6",
						children: "Tap the heart on any sneaker to save it here."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: "Browse shop"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6",
				children: items.map((item) => {
					const p = item.product;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Remove ${p.name}`,
									disabled: removeItem.isPending,
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
										handleRemove(item.id, p.name);
									},
									className: "absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/90 backdrop-blur grid place-items-center hover:bg-destructive hover:text-destructive-foreground transition disabled:opacity-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: addItem.isPending,
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
										handleAddToCart(p.defaultVariantId ?? item.variantId, p.name, p.img, e);
									},
									className: "absolute bottom-3 left-3 right-3 z-10 h-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-accent disabled:opacity-50",
									children: t("addToCart")
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
					}, item.id);
				})
			})]
		})]
	});
}
//#endregion
export { WishlistPage as component };
