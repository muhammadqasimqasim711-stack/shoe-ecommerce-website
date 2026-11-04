import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { n as ORDER_STATUSES, s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Route } from "./admin.orders._id-BZZl1hVl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders._id-CIFe9Wg0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminOrderDetailPage() {
	const { id } = Route.useParams();
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"admin",
			"order",
			id
		],
		queryFn: () => api.admin.order(id)
	});
	const [status, setStatus] = (0, import_react.useState)("");
	const [trackingNumber, setTrackingNumber] = (0, import_react.useState)("");
	const [shippingStatus, setShippingStatus] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setStatus(String(data.status ?? ""));
		setTrackingNumber(String(data.trackingNumber ?? ""));
		setShippingStatus(String(data.shippingStatus ?? ""));
	}, [data]);
	const update = useMutation({
		mutationFn: () => api.admin.updateOrder(id, {
			status,
			trackingNumber: trackingNumber || void 0,
			shippingStatus: shippingStatus || void 0,
			note: note || void 0
		}),
		onSuccess: () => {
			toast.success("Order updated");
			setNote("");
			queryClient.invalidateQueries({ queryKey: [
				"admin",
				"order",
				id
			] });
			queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: () => toast.error("Could not update order")
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" });
	if (isError || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-amber-600",
		children: "Order not found."
	});
	const items = data.items ?? [];
	const events = data.statusEvents ?? [];
	const user = data.user;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Order ${id.slice(0, 8)}…`,
				description: `${user?.email ?? data.email ?? "—"} · ${new Date(String(data.createdAt)).toLocaleString()}`,
				backTo: "/admin/orders",
				backLabel: "Orders",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: String(data.status) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-4 rounded-xl border border-border bg-background p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Update order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: status,
								onChange: (e) => setStatus(e.target.value),
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								children: ORDER_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tracking number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: trackingNumber,
								onChange: (e) => setTrackingNumber(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shipping status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: shippingStatus,
								onChange: (e) => setShippingStatus(e.target.value),
								placeholder: "In transit, Out for delivery…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: note,
								onChange: (e) => setNote(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: update.isPending,
							onClick: () => update.mutate(),
							children: update.isPending ? "Saving…" : "Save changes"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3 rounded-xl border border-border bg-background p-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Subtotal: ", formatMoney(Number(data.subtotal))] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Shipping: ",
							formatMoney(Number(data.shippingCost)),
							" (",
							String(data.shippingMethod ?? "—"),
							")"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Discount: ", formatMoney(Number(data.discountAmount))] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-lg font-bold",
							children: ["Total: ", formatMoney(Number(data.totalAmount))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "pt-2 text-muted-foreground",
							children: [
								"Ship to:",
								" ",
								[
									data.shipName,
									data.shipLine1,
									data.shipCity,
									data.shipState,
									data.shipZip
								].filter(Boolean).join(", ") || "—"
							]
						}),
						user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Customer:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/customers/$id",
								params: { id: String(data.user.id) },
								className: "text-accent hover:underline",
								children: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
							})
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-semibold",
				children: "Items"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between rounded-lg border border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						String(item.productName ?? "Item"),
						item.size ? ` · ${String(item.size)}` : "",
						" × ",
						Number(item.quantity)
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(Number(item.price) * Number(item.quantity)) })]
				}, String(item.id)))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-semibold",
				children: "Timeline"
			}), events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No status events yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3 border-l border-border pl-4",
				children: events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "relative text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full bg-accent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: String(ev.status ?? ev.toStatus ?? "Update")
						}),
						ev.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: String(ev.note)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: new Date(String(ev.createdAt)).toLocaleString()
						})
					]
				}, String(ev.id)))
			})] })
		]
	});
}
//#endregion
export { AdminOrderDetailPage as component };
