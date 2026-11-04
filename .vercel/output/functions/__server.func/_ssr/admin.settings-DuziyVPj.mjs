import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DuziyVPj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettingsPage() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["admin", "settings"],
		queryFn: () => api.admin.settings()
	});
	const [storeName, setStoreName] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [freeShippingThreshold, setFreeShippingThreshold] = (0, import_react.useState)("100");
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setStoreName(String(data.storeName ?? ""));
		setCurrency(String(data.currency ?? "USD"));
		setFreeShippingThreshold(String(data.freeShippingThreshold ?? 100));
	}, [data]);
	const save = useMutation({
		mutationFn: () => api.admin.updateSettings({
			storeName,
			currency,
			freeShippingThreshold: Number(freeShippingThreshold)
		}),
		onSuccess: () => {
			toast.success("Settings saved");
			queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
		},
		onError: () => toast.error("Could not save settings")
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Settings",
				description: "Store-wide configuration"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4 rounded-xl border border-border bg-background p-5",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Store name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: storeName,
							onChange: (e) => setStoreName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Currency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: currency,
							onChange: (e) => setCurrency(e.target.value)
						})]
					}),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						children: save.isPending ? "Saving…" : "Save settings"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-background p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-semibold",
					children: "Related"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/shipping",
							className: "text-accent hover:underline",
							children: "Shipping settings"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/support",
							className: "text-accent hover:underline",
							children: "Support inbox"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/newsletter",
							className: "text-accent hover:underline",
							children: "Newsletter subscribers"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/brands",
							className: "text-accent hover:underline",
							children: "Brands"
						}) })
					]
				})]
			})
		]
	});
}
//#endregion
export { AdminSettingsPage as component };
