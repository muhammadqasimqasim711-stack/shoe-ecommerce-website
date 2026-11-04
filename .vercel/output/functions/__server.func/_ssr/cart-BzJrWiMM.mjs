import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { T as Plus, d as Trash2, k as Minus, v as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { c as useCart, n as SiteHeader } from "./site-header-yEx0p83x.mjs";
import { t as ProductImage } from "./product-image-ClW4tcdv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-BzJrWiMM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { cart, isLoading, updateItem, removeItem, applyCoupon, removeCoupon } = useCart();
	const { t, formatMoney } = useLocale();
	const [couponInput, setCouponInput] = (0, import_react.useState)("");
	const items = cart?.items ?? [];
	const handleQty = async (itemId, quantity) => {
		if (quantity < 1) return;
		try {
			await updateItem.mutateAsync({
				itemId,
				quantity
			});
		} catch {
			toast.error("Could not update quantity.");
		}
	};
	const handleRemove = async (itemId, name) => {
		try {
			await removeItem.mutateAsync(itemId);
			toast.success(`${name} removed`);
		} catch {
			toast.error("Could not remove item.");
		}
	};
	const handleApplyCoupon = async () => {
		if (!couponInput.trim()) return;
		try {
			await applyCoupon.mutateAsync(couponInput.trim());
			toast.success("Coupon applied");
			setCouponInput("");
		} catch {
			toast.error("Invalid or expired coupon.");
		}
	};
	const handleRemoveCoupon = async () => {
		try {
			await removeCoupon.mutateAsync();
			toast.success("Coupon removed");
		} catch {
			toast.error("Could not remove coupon.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { showSearch: false }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-4 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:underline",
							children: "Home"
						}),
						" ",
						"/ Cart"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl md:text-5xl font-black tracking-tighter",
					children: t("yourBag")
				})]
			}), isLoading && !cart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i))
			}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight mb-2",
						children: "Your bag is empty"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mb-6",
						children: "Add sneakers from the shop to get started."
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
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-[1fr_340px] gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 rounded-2xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products/$id",
									params: { id: item.product.id },
									className: "block h-full w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
										src: item.product.img,
										alt: item.product.name,
										className: "h-full w-full object-cover"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-wider text-muted-foreground",
										children: item.product.brand
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold truncate",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/products/$id",
											params: { id: item.product.id },
											className: "hover:text-accent transition",
											children: item.product.name
										})
									}),
									(item.product.size || item.product.color) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: [item.product.size, item.product.color].filter(Boolean).join(" · ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center rounded-full border border-border",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "h-8 w-8 grid place-items-center",
													onClick: () => handleQty(item.id, item.quantity - 1),
													disabled: item.quantity <= 1 || updateItem.isPending,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-8 text-center text-sm font-medium",
													children: item.quantity
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "h-8 w-8 grid place-items-center",
													onClick: () => handleQty(item.id, item.quantity + 1),
													disabled: updateItem.isPending,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-muted-foreground hover:text-destructive",
											onClick: () => handleRemove(item.id, item.product.name),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold whitespace-nowrap",
								children: formatMoney(item.lineTotal, { round: true })
							})
						]
					}, item.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-2xl border border-border bg-muted/30 p-6 h-fit space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-black tracking-tight",
							children: t("summary")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: t("subtotal")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(cart.subtotal) })]
						}),
						(cart.discount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t("discount"), cart.couponCode ? ` (${cart.couponCode})` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatMoney(cart.discount ?? 0)] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: t("shipping")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (cart.shippingEstimate ?? 0) === 0 ? t("free") : formatMoney(cart.shippingEstimate ?? 0) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between font-bold text-lg border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("total") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(cart.total ?? cart.subtotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: t("paidInUsd")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 space-y-2",
							children: [cart.couponCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium",
									children: ["Code: ", cart.couponCode]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: handleRemoveCoupon,
									children: "Remove"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Coupon code",
									value: couponInput,
									onChange: (e) => setCouponInput(e.target.value)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: handleApplyCoupon,
									children: "Apply"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Try SOLE10 or FREESHIP"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full rounded-full h-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/checkout",
								children: t("checkout")
							})
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { CartPage as component };
