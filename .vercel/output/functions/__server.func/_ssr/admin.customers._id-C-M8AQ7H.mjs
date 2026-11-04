import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as MessageSquare, J as DollarSign, M as MapPin, _ as Sparkles, g as SquarePen, rt as Calendar, u as TrendingUp, v as ShoppingBag, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { a as formatDate, o as formatDateTime, s as formatMoney } from "./staff-C5pUFFY_.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
import { t as Route } from "./admin.customers._id-BI_FhT5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers._id-C-M8AQ7H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomerDetailPage() {
	const { id } = Route.useParams();
	const queryClient = useQueryClient();
	const [note, setNote] = (0, import_react.useState)("");
	const [confirmDisable, setConfirmDisable] = (0, import_react.useState)(false);
	const [isEditing, setIsEditing] = (0, import_react.useState)(false);
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"admin",
			"customer",
			id
		],
		queryFn: () => api.admin.customer(id)
	});
	(0, import_react.useEffect)(() => {
		if (data) {
			setFirstName(String(data.firstName || ""));
			setLastName(String(data.lastName || ""));
			setPhone(String(data.phone || ""));
		}
	}, [data]);
	const toggleDisabled = useMutation({
		mutationFn: (disabled) => api.admin.updateCustomer(id, { disabled }),
		onSuccess: () => {
			toast.success("Customer status updated");
			setConfirmDisable(false);
			queryClient.invalidateQueries({ queryKey: [
				"admin",
				"customer",
				id
			] });
			queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "crm"] });
		},
		onError: () => toast.error("Could not update customer")
	});
	const updateProfile = useMutation({
		mutationFn: () => api.admin.updateCustomer(id, {
			firstName: firstName.trim() || null,
			lastName: lastName.trim() || null,
			phone: phone.trim() || null
		}),
		onSuccess: () => {
			toast.success("Customer profile updated");
			setIsEditing(false);
			queryClient.invalidateQueries({ queryKey: [
				"admin",
				"customer",
				id
			] });
			queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "crm"] });
		},
		onError: () => toast.error("Failed to update profile")
	});
	const addNote = useMutation({
		mutationFn: () => api.admin.addCustomerNote(id, note.trim()),
		onSuccess: () => {
			toast.success("Note added");
			setNote("");
			queryClient.invalidateQueries({ queryKey: [
				"admin",
				"customer",
				id
			] });
			queryClient.invalidateQueries({ queryKey: ["admin", "crm"] });
		},
		onError: () => toast.error("Could not add note")
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" })
		]
	});
	if (isError || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Customer Details",
			backTo: "/admin/customers",
			backLabel: "Customers"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border p-6 text-center text-destructive",
			children: "Customer not found or failed to load."
		})]
	});
	const metrics = data.metrics ?? {};
	const segments = data.segments ?? [];
	const orders = data.orders ?? [];
	const addresses = data.addresses ?? [];
	const notes = data.notes ?? data.customerNotes ?? [];
	const returns = data.returns ?? [];
	const disabled = Boolean(data.disabled);
	const customerName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "No name registered";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: String(data.email),
				description: `${customerName} · Registered ${formatDate(data.registration || data.createdAt)}`,
				backTo: "/admin/customers",
				backLabel: "Customers",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setIsEditing(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "mr-1.5 h-3.5 w-3.5" }), " Edit Profile"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: disabled ? "disabled" : "active" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: disabled ? "default" : "destructive",
							size: "sm",
							onClick: () => setConfirmDisable(true),
							children: disabled ? "Enable Account" : "Disable Account"
						})
					]
				})
			}),
			segments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 -mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-accent" }), " Assigned Segments:"]
				}), segments.map((seg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/segments",
					search: { segment: seg },
					className: "rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold uppercase text-accent hover:bg-accent hover:text-accent-foreground transition-colors",
					children: seg
				}, seg))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase font-semibold",
									children: "Total Spend"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-accent" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-bold text-accent",
								children: formatMoney(Number(metrics.totalSpending || 0))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "Cumulative lifetime value"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase font-semibold",
									children: "Total Orders"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4 text-blue-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-bold",
								children: metrics.totalOrders || 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "Non-cancelled purchases"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase font-semibold",
									children: "Average Order Value"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-emerald-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-bold",
								children: formatMoney(Number(metrics.averageOrderValue || 0))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "AOV across all orders"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase font-semibold",
									children: "Last Order"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4 text-purple-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold truncate",
								children: formatDate(metrics.lastOrderAt, "No orders yet")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "Most recent activity"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-card p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-semibold text-base flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4 text-accent" }),
										" Order History (",
										orders.length,
										")"
									]
								})
							}), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground py-4 text-center",
								children: "No orders placed by this customer."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "border-b border-border/60 text-xs font-semibold text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Order ID"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Date"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Items"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3 text-right",
												children: "Total"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/40",
										children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
														to: "/admin/orders/$id",
														params: { id: String(o.id) },
														className: "font-medium text-accent hover:underline font-mono text-xs",
														children: [String(o.id).slice(0, 8), "…"]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 text-xs text-muted-foreground",
													children: formatDate(o.createdAt)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: String(o.status) })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3 text-xs",
													children: [Number(o.itemCount || 1), " items"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 text-right font-bold",
													children: formatMoney(Number(o.totalAmount), String(o.currency || "USD"))
												})
											]
										}, String(o.id)))
									})]
								})
							})]
						}),
						returns.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-card p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-semibold text-base flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-amber-500" }),
									" Return Requests (",
									returns.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border/60",
								children: returns.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-3 first:pt-0 last:pb-0 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium text-xs",
										children: ["Reason: ", String(r.reason || "Not specified")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: [
											"Order #",
											String(r.orderId || "").slice(0, 8),
											"… ·",
											" ",
											formatDate(r.createdAt)
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: String(r.status) })]
								}, String(r.id)))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-card p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-semibold text-base flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-accent" }),
									" Saved Addresses (",
									addresses.length,
									")"
								]
							}), addresses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground py-2 text-center",
								children: "No addresses on file."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border p-3.5 text-xs space-y-1 bg-background/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center justify-between font-semibold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Boolean(a.isDefault) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-accent text-[10px] font-bold uppercase mr-1.5",
												children: "[Default]"
											}), "Address"] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-foreground",
											children: String(a.line1)
										}),
										a.line2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: String(a.line2)
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												String(a.city),
												", ",
												String(a.state),
												" ",
												String(a.zipCode)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground font-mono text-[11px]",
											children: String(a.country)
										})
									]
								}, String(a.id)))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-card p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold text-sm",
								children: "Contact Information"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-7 text-xs",
								onClick: () => setIsEditing(true),
								children: "Edit"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-xs divide-y divide-border/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 first:pt-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[11px]",
										children: "Full Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: customerName
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[11px]",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `mailto:${data.email}`,
										className: "font-medium text-accent hover:underline",
										children: String(data.email)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[11px]",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: String(data.phone || "—")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[11px]",
										children: "Account Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium capitalize",
										children: disabled ? "Disabled" : "Active"
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-card p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-semibold text-sm flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-accent" }),
									" Internal Staff Notes (",
									notes.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									placeholder: "Log customer phone call, VIP preference, or support interaction…",
									value: note,
									onChange: (e) => setNote(e.target.value),
									className: "text-xs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: !note.trim() || addNote.isPending,
									onClick: () => addNote.mutate(),
									className: "w-full text-xs",
									children: addNote.isPending ? "Adding…" : "Add Staff Note"
								})]
							}),
							notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground py-4 text-center",
								children: "No internal notes logged yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 pt-2 border-t border-border/60 max-h-96 overflow-y-auto",
								children: notes.map((n) => {
									const author = n.author;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border/80 bg-background/50 p-3 text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: [author?.firstName, author?.lastName].filter(Boolean).join(" ") || author?.email || "Staff"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDateTime(n.createdAt) })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-foreground leading-relaxed whitespace-pre-wrap",
											children: String(n.body)
										})]
									}, String(n.id));
								})
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isEditing,
				onOpenChange: setIsEditing,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Customer Profile" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "firstName",
										children: "First Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "firstName",
										value: firstName,
										onChange: (e) => setFirstName(e.target.value),
										placeholder: "First name"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "lastName",
										children: "Last Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "lastName",
										value: lastName,
										onChange: (e) => setLastName(e.target.value),
										placeholder: "Last name"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "phone",
									children: "Phone Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "+1 (555) 000-0000"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsEditing(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => updateProfile.mutate(),
							disabled: updateProfile.isPending,
							children: updateProfile.isPending ? "Saving…" : "Save Changes"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmDisable,
				onOpenChange: setConfirmDisable,
				title: disabled ? "Enable customer account?" : "Disable customer account?",
				description: disabled ? "The customer will be able to log in and make purchases again." : "The customer will be prevented from signing in to their account.",
				confirmLabel: disabled ? "Enable Account" : "Disable Account",
				destructive: !disabled,
				loading: toggleDisabled.isPending,
				onConfirm: () => toggleDisabled.mutate(!disabled)
			})
		]
	});
}
//#endregion
export { AdminCustomerDetailPage as component };
