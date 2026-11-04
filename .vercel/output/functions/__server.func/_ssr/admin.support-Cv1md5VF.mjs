import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.support-Cv1md5VF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSupportPage() {
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "support"],
		queryFn: () => api.admin.support(100)
	});
	const selected = data.find((m) => m.id === selectedId) ?? data[0] ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-2xl font-black tracking-tight mb-6",
		children: "Support inbox"
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No support messages yet."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[280px_1fr] gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "rounded-xl border border-border bg-background divide-y divide-border max-h-[70vh] overflow-auto",
			children: data.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setSelectedId(m.id),
				className: `w-full text-left p-3 text-sm hover:bg-muted/50 ${selected?.id === m.id ? "bg-muted" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium truncate",
						children: m.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground truncate",
						children: m.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mt-1",
						children: new Date(m.createdAt).toLocaleString()
					})
				]
			}) }, m.id))
		}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-background p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: selected.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mb-4",
					children: selected.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm whitespace-pre-wrap leading-relaxed",
					children: selected.message
				})
			]
		})]
	})] });
}
//#endregion
export { AdminSupportPage as component };
