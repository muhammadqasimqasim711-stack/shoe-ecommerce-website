import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { o as formatDateTime } from "./staff-C5pUFFY_.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.audit-Ch2GZ_8k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminAuditPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"audit",
			search
		],
		queryFn: () => api.admin.auditLogs({
			search: search || void 0,
			limit: 100
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Audit logs",
		description: "Recent admin actions",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			placeholder: "Filter by entity…",
			value: search,
			onChange: (e) => setSearch(e.target.value),
			className: "max-w-xs"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		columns: [
			"When",
			"Action",
			"Entity",
			"Entity ID",
			"User"
		],
		loading: isLoading,
		isEmpty: data.length === 0,
		children: data.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-b border-border/60 hover:bg-muted/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3 whitespace-nowrap text-xs text-muted-foreground",
					children: formatDateTime(log.createdAt)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3 font-medium",
					children: log.action
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3",
					children: log.entity
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3 font-mono text-xs",
					children: log.entityId?.slice(0, 12) ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3 text-xs",
					children: log.userId?.slice(0, 8) ?? "—"
				})
			]
		}, log.id))
	})] });
}
//#endregion
export { AdminAuditPage as component };
