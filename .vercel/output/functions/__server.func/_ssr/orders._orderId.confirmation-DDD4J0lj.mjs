import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Q as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { n as SiteHeader } from "./site-header-yEx0p83x.mjs";
import { t as ProductImage } from "./product-image-ClW4tcdv.mjs";
import { t as Route } from "./orders._orderId.confirmation-CSbZqEDm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders._orderId.confirmation-DDD4J0lj.js
var import_jsx_runtime = require_jsx_runtime();
function ConfirmationPage() {
	const { orderId } = Route.useParams();
	const { formatMoney, t } = useLocale();
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"order",
			"confirmation",
			orderId
		],
		queryFn: () => api.getOrderConfirmation(orderId)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { showSearch: false }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-10",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-2/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-2xl" })]
			}) : isError || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-black tracking-tighter mb-3",
					children: "Order not found"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Continue shopping"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-12 w-12 text-emerald-600 mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl font-black tracking-tighter",
								children: "Order confirmed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									"Thanks",
									data.email ? `, ${data.email}` : "",
									". Status:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: data.status
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground font-mono",
								children: ["Order ID: ", data.orderId]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border p-6 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-black tracking-tight",
							children: "Items"
						}), data.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
										src: item.img,
										alt: item.name,
										className: "h-full w-full object-cover"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs uppercase text-muted-foreground",
											children: item.brand
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold truncate",
											children: item.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: ["Qty ", item.quantity]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold",
									children: formatMoney(item.price * item.quantity)
								})
							]
						}, `${item.name}-${i}`))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border p-6 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-black tracking-tight mb-3",
								children: t("shipping")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium capitalize",
								children: [
									data.shipping.method ?? "standard",
									" · ",
									formatMoney(data.shipping.cost)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								data.shipping.address.name,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								data.shipping.address.line1,
								data.shipping.address.line2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}), data.shipping.address.line2] }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								data.shipping.address.city,
								", ",
								data.shipping.address.state,
								" ",
								data.shipping.address.zipCode,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								data.shipping.address.country
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border p-6 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-black tracking-tight mb-3",
								children: "Payment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: data.payment ? `${data.payment.provider} · ${data.payment.status} · ${formatMoney(data.payment.amount)}` : "Pending" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-3 mt-3 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("subtotal")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(data.totals.subtotal) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("discount")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatMoney(data.totals.discount)] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("shipping")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(data.totals.shipping) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-bold text-base pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("total") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											formatMoney(data.totals.total),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-normal text-muted-foreground",
												children: [
													"(",
													data.totals.currency,
													")"
												]
											})
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground pt-2",
										children: t("paidInUsd")
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								children: "Continue shopping"
							})
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { ConfirmationPage as component };
