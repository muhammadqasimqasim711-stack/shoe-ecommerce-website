import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api, t as ApiError } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SiteHeader } from "./site-header-JEgEYlzV.mjs";
import { t as SiteFooter } from "./site-footer-Bxfa9-Wn.mjs";
import { t as CmsHtml } from "./cms-html-RzYu_O3M.mjs";
import { t as Route } from "./help._slug-BP9GNTTQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help._slug-CO3eBNOq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HelpSlugPage() {
	const { slug } = Route.useParams();
	const { data: page, isLoading, isError } = useQuery({
		queryKey: [
			"cms",
			"page",
			slug
		],
		queryFn: () => api.getCmsPage(slug),
		staleTime: 6e4
	});
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const onContact = async (e) => {
		e.preventDefault();
		setSending(true);
		try {
			await api.submitContact({
				name: name.trim(),
				email: email.trim(),
				message: message.trim()
			});
			toast.success("Message sent — we'll get back to you soon.");
			setName("");
			setEmail("");
			setMessage("");
		} catch (err) {
			toast.error(err instanceof ApiError && err.status === 400 ? "Check your name, email, and message." : "Could not send message. Is the backend running?");
		} finally {
			setSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:underline",
							children: "Home"
						}),
						" ",
						"/",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/help",
							className: "hover:underline",
							children: "Help"
						}),
						" ",
						"/ ",
						page?.title ?? slug
					]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-2/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })]
				}) : isError || !page ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black tracking-tighter mb-3",
						children: "Page not found"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/help",
							children: "Back to Help"
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl font-black tracking-tighter mb-8",
						children: page.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsHtml, {
						html: page.content,
						className: "prose-sole text-muted-foreground leading-relaxed mb-10"
					}),
					slug === "contact" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onContact,
						className: "space-y-4 rounded-2xl border border-border p-6 bg-muted/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-black tracking-tight",
								children: "Send a message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								placeholder: "Your name",
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "h-11 rounded-full px-5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "email",
								placeholder: "Email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "h-11 rounded-full px-5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								minLength: 5,
								placeholder: "How can we help?",
								value: message,
								onChange: (e) => setMessage(e.target.value),
								rows: 5,
								className: "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "rounded-full",
								disabled: sending,
								children: sending ? "Sending…" : "Send message"
							})
						]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { HelpSlugPage as component };
