import { t as cn } from "./utils-C_uf36nf.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BFfSwLc6.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STYLES = {
	PUBLISHED: "bg-emerald-100 text-emerald-800 border-emerald-200",
	SCHEDULED: "bg-sky-100 text-sky-900 border-sky-200",
	ACTIVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
	OUT_OF_STOCK: "bg-amber-100 text-amber-900 border-amber-200",
	ARCHIVED: "bg-slate-100 text-slate-700 border-slate-200",
	Pending: "bg-amber-100 text-amber-900 border-amber-200",
	Confirmed: "bg-sky-100 text-sky-900 border-sky-200",
	Processing: "bg-blue-100 text-blue-900 border-blue-200",
	Packed: "bg-indigo-100 text-indigo-900 border-indigo-200",
	Shipped: "bg-violet-100 text-violet-900 border-violet-200",
	Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
	Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
	Returned: "bg-orange-100 text-orange-900 border-orange-200",
	Refunded: "bg-rose-50 text-rose-700 border-rose-200",
	approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
	pending: "bg-amber-100 text-amber-900 border-amber-200",
	hidden: "bg-slate-100 text-slate-700 border-slate-200",
	active: "bg-emerald-100 text-emerald-800 border-emerald-200",
	disabled: "bg-rose-100 text-rose-800 border-rose-200",
	Paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
	Failed: "bg-rose-100 text-rose-800 border-rose-200",
	Requested: "bg-amber-100 text-amber-900 border-amber-200",
	Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
	Rejected: "bg-rose-100 text-rose-800 border-rose-200",
	Closed: "bg-slate-100 text-slate-700 border-slate-200"
};
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: cn("font-medium capitalize", STATUS_STYLES[status] ?? "bg-muted text-muted-foreground", className),
		children: status.replaceAll("_", " ").toLowerCase()
	});
}
//#endregion
export { StatusBadge as t };
