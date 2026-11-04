import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.roles-x83MKC2I.js
var import_jsx_runtime = require_jsx_runtime();
function AdminRolesPage() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "roles"],
		queryFn: () => api.admin.roles()
	});
	const allPermissions = Array.from(new Set(data.flatMap((r) => r.permissions.map((p) => p.action)))).sort();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Roles & permissions",
		description: "Read-only matrix of staff capabilities"
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto rounded-xl border border-border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-left text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "p-3 font-medium",
					children: "Permission"
				}), data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					className: "p-3 font-medium whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.name.replaceAll("_", " ") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs font-normal",
						children: [r.userCount, " users"]
					})]
				}, r.id))] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: allPermissions.map((perm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3 font-mono text-xs",
					children: perm
				}), data.map((r) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-center",
						children: r.permissions.some((p) => p.action === perm) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-600",
							children: "✓"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "—"
						})
					}, r.id);
				})]
			}, perm)) })]
		}), data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-muted-foreground",
			children: "No roles found."
		})]
	})] });
}
//#endregion
export { AdminRolesPage as component };
