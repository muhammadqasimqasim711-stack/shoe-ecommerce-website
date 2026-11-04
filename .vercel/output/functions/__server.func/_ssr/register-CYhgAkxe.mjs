import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as ApiError } from "./api-qljhtqOX.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SiteHeader, o as useAuth } from "./site-header-yEx0p83x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-CYhgAkxe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const navigate = useNavigate();
	const { register, isAuthenticated } = useAuth();
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (isAuthenticated) navigate({
			to: "/",
			replace: true
		});
	}, [isAuthenticated, navigate]);
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			await register.mutateAsync({
				email: email.trim(),
				password,
				firstName: firstName.trim() || void 0,
				lastName: lastName.trim() || void 0
			});
			toast.success("Account created");
			navigate({
				to: "/",
				replace: true
			});
		} catch (err) {
			const msg = err instanceof ApiError && err.status === 409 ? "Email already registered" : "Could not create account. Is the backend running?";
			toast.error(msg);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { showSearch: false }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md px-4 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-black tracking-tighter mb-2",
					children: "Create account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground text-sm mb-8",
					children: [
						"Already have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-accent hover:underline",
							children: "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "First name",
								value: firstName,
								onChange: (e) => setFirstName(e.target.value),
								className: "h-11 rounded-full px-5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Last name",
								value: lastName,
								onChange: (e) => setLastName(e.target.value),
								className: "h-11 rounded-full px-5"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							required: true,
							placeholder: "Email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "h-11 rounded-full px-5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							required: true,
							minLength: 8,
							placeholder: "Password (min 8 characters)",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "h-11 rounded-full px-5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full rounded-full h-11",
							disabled: register.isPending,
							children: register.isPending ? "Creating…" : "Create account"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { RegisterPage as component };
