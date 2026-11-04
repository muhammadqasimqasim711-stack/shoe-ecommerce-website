import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
import { t as STAFF_ROLES } from "./types-BdW_FQEI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-DGdzez8p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminUsersPage() {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "users"],
		queryFn: () => api.admin.users()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("ADMIN");
	function openCreate() {
		setEditing(null);
		setEmail("");
		setPassword("");
		setFirstName("");
		setLastName("");
		setRole("ADMIN");
		setOpen(true);
	}
	function openEdit(u) {
		setEditing(u);
		setEmail(u.email);
		setPassword("");
		setFirstName(u.firstName ?? "");
		setLastName(u.lastName ?? "");
		setRole(u.role);
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: () => {
			if (editing) return api.admin.updateUser(editing.id, {
				firstName: firstName || null,
				lastName: lastName || null,
				role,
				...password ? { password } : {}
			});
			return api.admin.createUser({
				email: email.trim(),
				password,
				firstName: firstName || void 0,
				lastName: lastName || void 0,
				role
			});
		},
		onSuccess: () => {
			toast.success(editing ? "User updated" : "User created");
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
		},
		onError: () => toast.error("Could not save user")
	});
	const toggle = useMutation({
		mutationFn: ({ id, disabled }) => api.admin.updateUser(id, { disabled }),
		onSuccess: () => {
			toast.success("User updated");
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
		},
		onError: () => toast.error("Could not update user")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Admin users",
			description: "Staff accounts and roles",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: openCreate,
				children: "Add user"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"User",
				"Role",
				"Status",
				"Joined",
				""
			],
			loading: isLoading,
			isEmpty: data.length === 0,
			children: data.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/60 hover:bg-muted/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: u.email
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-sm",
						children: u.role.replaceAll("_", " ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: u.disabled ? "disabled" : "active" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: new Date(u.createdAt).toLocaleDateString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => openEdit(u),
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => toggle.mutate({
									id: u.id,
									disabled: !u.disabled
								}),
								children: u.disabled ? "Enable" : "Disable"
							})]
						})
					})
				]
			}, u.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit staff user" : "Add staff user" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "First name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: firstName,
									onChange: (e) => setFirstName(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Last name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: lastName,
									onChange: (e) => setLastName(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: role,
								onChange: (e) => setRole(e.target.value),
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								children: STAFF_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: r.replaceAll("_", " ")
								}, r))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: editing ? "New password (optional)" : "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								minLength: editing ? void 0 : 8
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !editing && (!email.trim() || password.length < 8) || save.isPending,
					onClick: () => save.mutate(),
					children: "Save"
				})] })
			] })
		})
	] });
}
//#endregion
export { AdminUsersPage as component };
