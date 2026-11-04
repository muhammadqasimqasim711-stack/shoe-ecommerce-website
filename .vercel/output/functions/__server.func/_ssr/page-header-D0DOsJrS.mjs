import { t as cn } from "./utils-C_uf36nf.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { ct as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-header-D0DOsJrS.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, description, actions, backTo, backLabel = "Back", className }) {
	const router = useRouter();
	const handleBackClick = (e) => {
		if (typeof window !== "undefined" && window.history.length > 1) {
			e.preventDefault();
			if (document.referrer && document.referrer.includes(window.location.origin)) {
				window.history.back();
				return;
			}
			try {
				router.history.back();
				return;
			} catch {}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mb-6 flex flex-wrap items-start justify-between gap-4", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			backTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: backTo,
				onClick: handleBackClick,
				className: "group mb-1.5 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-accent transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: backLabel })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black tracking-tight",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			})
		] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: actions
		})]
	});
}
//#endregion
export { PageHeader as t };
