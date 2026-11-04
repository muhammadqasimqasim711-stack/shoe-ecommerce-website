import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { c as useCart, n as SiteHeader } from "./site-header-yEx0p83x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BD6Q2GId.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const navigate = useNavigate();
	const { cart, cartId, clearLocalCart, isLoading } = useCart();
	const { t, formatMoney } = useLocale();
	const [email, setEmail] = (0, import_react.useState)("");
	const [shippingMethod, setShippingMethod] = (0, import_react.useState)("standard");
	const [methods, setMethods] = (0, import_react.useState)([]);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [address, setAddress] = (0, import_react.useState)({
		name: "",
		line1: "",
		line2: "",
		city: "",
		state: "",
		zipCode: "",
		country: "US"
	});
	(0, import_react.useEffect)(() => {
		if (!cartId || !cart?.items.length) return;
		(async () => {
			try {
				const rates = await api.getShippingRates({
					cartId,
					country: address.country || "US",
					zipCode: address.zipCode || void 0
				});
				setMethods(rates.methods);
			} catch {}
		})();
	}, [
		cartId,
		cart?.items.length,
		address.country,
		address.zipCode
	]);
	(0, import_react.useEffect)(() => {
		if (!cartId || !cart?.items.length) return;
		(async () => {
			try {
				const next = await api.checkoutPreview({
					cartId,
					shippingMethod,
					couponCode: cart.couponCode ?? void 0
				});
				setPreview(next);
			} catch {
				setPreview(null);
			}
		})();
	}, [
		cartId,
		cart?.items.length,
		cart?.couponCode,
		shippingMethod
	]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (submitting) return;
		if (!cartId) {
			toast.error("Your cart is empty.");
			return;
		}
		setSubmitting(true);
		try {
			const placed = await api.placeOrder({
				cartId,
				email,
				shippingMethod,
				address: {
					name: address.name,
					line1: address.line1,
					line2: address.line2 || void 0,
					city: address.city,
					state: address.state,
					zipCode: address.zipCode,
					country: address.country
				},
				couponCode: cart?.couponCode ?? void 0,
				paymentMethod: "mock"
			});
			await api.payOrder(placed.orderId, {
				provider: "mock",
				cardLast4: "4242"
			});
			clearLocalCart();
			toast.success("Order confirmed");
			navigate({
				to: "/orders/$orderId/confirmation",
				params: { orderId: placed.orderId }
			});
		} catch {
			toast.error("Checkout failed. Check details and try again.");
		} finally {
			setSubmitting(false);
		}
	};
	if (!isLoading && (!cart || cart.items.length === 0)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { showSearch: false }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-black tracking-tighter mb-3",
					children: "Nothing to checkout"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mb-6",
					children: "Add products to your bag first."
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
		})]
	});
	const totals = preview;
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
							to: "/cart",
							className: "hover:underline",
							children: "Cart"
						}),
						" ",
						"/ Checkout"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl md:text-5xl font-black tracking-tighter",
					children: "Checkout"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "grid lg:grid-cols-[1fr_360px] gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-black tracking-tight",
								children: "Contact"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "email",
								placeholder: "Email",
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-black tracking-tight",
									children: "Shipping address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "Full name",
									value: address.name,
									onChange: (e) => setAddress((a) => ({
										...a,
										name: e.target.value
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "Address line 1",
									value: address.line1,
									onChange: (e) => setAddress((a) => ({
										...a,
										line1: e.target.value
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Address line 2",
									value: address.line2,
									onChange: (e) => setAddress((a) => ({
										...a,
										line2: e.target.value
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "City",
										value: address.city,
										onChange: (e) => setAddress((a) => ({
											...a,
											city: e.target.value
										}))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "State",
										value: address.state,
										onChange: (e) => setAddress((a) => ({
											...a,
											state: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "ZIP",
										value: address.zipCode,
										onChange: (e) => setAddress((a) => ({
											...a,
											zipCode: e.target.value
										}))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "Country",
										value: address.country,
										onChange: (e) => setAddress((a) => ({
											...a,
											country: e.target.value
										}))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-black tracking-tight",
								children: "Shipping method"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: (methods.length ? methods : [{
									id: "standard",
									label: "Standard Shipping",
									amount: 5.99,
									etaDays: 5
								}, {
									id: "express",
									label: "Express Shipping",
									amount: 14.99,
									etaDays: 2
								}]).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `flex items-center justify-between rounded-2xl border p-4 cursor-pointer ${shippingMethod === m.id ? "border-accent bg-accent/5" : "border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "radio",
											name: "shipping",
											checked: shippingMethod === m.id,
											onChange: () => setShippingMethod(m.id)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium block",
											children: m.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [m.etaDays, " day delivery"]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: m.amount === 0 ? t("free") : formatMoney(m.amount)
									})]
								}, m.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-black tracking-tight",
								children: "Payment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Mock payment for local checkout — no real charge. Card ending in 4242."
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-2xl border border-border bg-muted/30 p-6 h-fit space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-black tracking-tight",
							children: "Order summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 text-sm",
							children: (cart?.items ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate",
									children: [
										item.product.name,
										" × ",
										item.quantity
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(item.lineTotal) })]
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: t("subtotal")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(totals?.subtotal ?? cart?.subtotal ?? 0) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: t("discount")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatMoney(totals?.discount ?? cart?.discount ?? 0)] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: t("shipping")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (totals?.shipping ?? 0) === 0 ? t("free") : formatMoney(totals?.shipping ?? 0) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-bold text-lg pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("total") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(totals?.total ?? cart?.total ?? cart?.subtotal ?? 0) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground pt-1",
									children: t("paidInUsd")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full rounded-full h-11",
							disabled: submitting,
							children: submitting ? "Placing order…" : "Place order & pay"
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { CheckoutPage as component };
