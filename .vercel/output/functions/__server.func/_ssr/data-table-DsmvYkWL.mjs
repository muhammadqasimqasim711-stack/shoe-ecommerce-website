import { t as cn } from "./utils-C_uf36nf.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-table-DsmvYkWL.js
var import_jsx_runtime = require_jsx_runtime();
function DataTable({ columns, loading, empty = "No results found.", isEmpty, children, className }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: cn("h-64 rounded-xl", className) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("overflow-x-auto rounded-xl border border-border bg-background", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-left text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((col, idx) => {
					const key = typeof col === "string" && col.trim() ? `th-${col}` : `th-idx-${idx}`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 font-medium whitespace-nowrap",
						children: col
					}, key);
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: !isEmpty ? children : null })]
		}), isEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-muted-foreground",
			children: empty
		})]
	});
}
//#endregion
export { DataTable as t };
