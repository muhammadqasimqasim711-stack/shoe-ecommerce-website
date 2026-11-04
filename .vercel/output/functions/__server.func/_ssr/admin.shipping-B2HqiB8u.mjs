import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.shipping-B2HqiB8u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminShippingPage() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["admin", "shipping"],
		queryFn: () => api.admin.shippingSettings()
	});
	const [freeShippingThreshold, setFreeShippingThreshold] = (0, import_react.useState)("100");
	const [shippingMethodsJson, setShippingMethodsJson] = (0, import_react.useState)("[]");
	const [shippingZonesJson, setShippingZonesJson] = (0, import_react.useState)("[]");
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setFreeShippingThreshold(String(data.freeShippingThreshold ?? 100));
		setShippingMethodsJson(String(data.shippingMethodsJson ?? "[]"));
		setShippingZonesJson(String(data.shippingZonesJson ?? "[]"));
	}, [data]);
	const save = useMutation({
		mutationFn: () => api.admin.updateShippingSettings({
			freeShippingThreshold: Number(freeShippingThreshold),
			shippingMethodsJson,
			shippingZonesJson
		}),
		onSuccess: () => {
			toast.success("Shipping settings saved");
			queryClient.invalidateQueries({ queryKey: ["admin", "shipping"] });
		},
		onError: () => toast.error("Could not save shipping settings")
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Shipping settings",
			description: "Rates, zones, and free-shipping threshold"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4 rounded-xl border border-border bg-background p-5",
			onSubmit: (e) => {
				e.preventDefault();
				save.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Free shipping threshold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						step: "0.01",
						value: freeShippingThreshold,
						onChange: (e) => setFreeShippingThreshold(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shipping methods (JSON)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 6,
						value: shippingMethodsJson,
						onChange: (e) => setShippingMethodsJson(e.target.value),
						className: "font-mono text-xs"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shipping zones (JSON)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 6,
						value: shippingZonesJson,
						onChange: (e) => setShippingZonesJson(e.target.value),
						className: "font-mono text-xs"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save settings"
				})
			]
		})]
	});
}
//#endregion
export { AdminShippingPage as component };
