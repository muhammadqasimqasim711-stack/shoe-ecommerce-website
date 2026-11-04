import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { i as RETURN_STATUSES } from "./staff-C5pUFFY_.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.returns-BksEn9hr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminReturnsPage() {
	const queryClient = useQueryClient();
	const [status, setStatus] = (0, import_react.useState)("");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [orderId, setOrderId] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"returns",
			status
		],
		queryFn: () => api.admin.returns({
			status: status || void 0,
			limit: 100
		})
	});
	const { data: detail, isLoading: detailLoading } = useQuery({
		queryKey: [
			"admin",
			"return",
			selectedId
		],
		queryFn: () => api.admin.getReturn(selectedId),
		enabled: !!selectedId
	});
	const [editStatus, setEditStatus] = (0, import_react.useState)("");
	const [resolution, setResolution] = (0, import_react.useState)("");
	const [refundAmount, setRefundAmount] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: () => api.admin.createReturn({
			orderId: orderId.trim(),
			reason: reason || void 0
		}),
		onSuccess: () => {
			toast.success("Return created");
			setCreateOpen(false);
			setOrderId("");
			setReason("");
			queryClient.invalidateQueries({ queryKey: ["admin", "returns"] });
		},
		onError: () => toast.error("Could not create return")
	});
	const update = useMutation({
		mutationFn: () => api.admin.updateReturn(selectedId, {
			status: editStatus || void 0,
			resolution: resolution || void 0,
			refundAmount: refundAmount ? Number(refundAmount) : void 0
		}),
		onSuccess: () => {
			toast.success("Return updated");
			queryClient.invalidateQueries({ queryKey: ["admin", "returns"] });
			queryClient.invalidateQueries({ queryKey: [
				"admin",
				"return",
				selectedId
			] });
		},
		onError: () => toast.error("Could not update return")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Returns",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All statuses"
						}), RETURN_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setCreateOpen(true),
						children: "Create return"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					columns: [
						"Return",
						"Order",
						"Status",
						"Date"
					],
					loading: isLoading,
					isEmpty: data.length === 0,
					children: data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: `cursor-pointer border-b border-border/60 hover:bg-muted/40 ${selectedId === r.id ? "bg-muted/50" : ""}`,
						onClick: () => {
							setSelectedId(r.id);
							setEditStatus(r.status);
							setResolution(r.resolution ?? "");
							setRefundAmount(r.refundAmount != null ? String(r.refundAmount) : "");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3",
								children: [r.id.slice(0, 8), "…"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin/orders/$id",
									params: { id: r.orderId },
									className: "text-accent hover:underline",
									onClick: (e) => e.stopPropagation(),
									children: [r.orderId.slice(0, 8), "…"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: new Date(r.createdAt).toLocaleDateString()
							})
						]
					}, r.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-background p-5",
					children: !selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Select a return to view details."
					}) : detailLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-semibold",
								children: [
									"Return ",
									selectedId.slice(0, 8),
									"…"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Reason: ", String(detail?.reason ?? "—")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: editStatus,
									onChange: (e) => setEditStatus(e.target.value),
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									children: RETURN_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Resolution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: resolution,
									onChange: (e) => setResolution(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Refund amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									step: "0.01",
									value: refundAmount,
									onChange: (e) => setRefundAmount(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: update.isPending,
								onClick: () => update.mutate(),
								children: "Save"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create return" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Order ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: orderId,
								onChange: (e) => setOrderId(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setCreateOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !orderId.trim() || create.isPending,
						onClick: () => create.mutate(),
						children: "Create"
					})] })
				] })
			})
		]
	});
}
//#endregion
export { AdminReturnsPage as component };
