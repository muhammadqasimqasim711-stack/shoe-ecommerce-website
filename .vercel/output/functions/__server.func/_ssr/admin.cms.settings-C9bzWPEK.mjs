import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.settings-C9bzWPEK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsSettingsPage() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"settings"
		],
		queryFn: () => api.admin.cms.settings()
	});
	const [form, setForm] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (data) setForm(data);
	}, [data]);
	const save = useMutation({
		mutationFn: () => api.admin.cms.updateSettings(form),
		onSuccess: () => {
			toast.success("CMS settings saved");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"settings"
			] });
			qc.invalidateQueries({ queryKey: ["cms", "settings"] });
		},
		onError: () => toast.error("Could not save settings")
	});
	const set = (key, value) => setForm((p) => ({
		...p,
		[key]: value
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "max-w-2xl space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "CMS settings",
				description: "Logo, contact, social, and newsletter copy. Store currency stays in CRM Settings.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save"
				})
			}),
			[
				["storeName", "Website name"],
				["logoUrl", "Logo URL"],
				["faviconUrl", "Favicon URL"],
				["contactEmail", "Contact email"],
				["contactPhone", "Contact phone"],
				["contactAddress", "Contact address"]
			].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form[key] ?? "",
				onChange: (e) => set(key, e.target.value)
			})] }, key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Footer text" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 3,
				value: form.footerText ?? "",
				onChange: (e) => set("footerText", e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Newsletter heading" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.newsletterHeading ?? "",
				onChange: (e) => set("newsletterHeading", e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Newsletter subtext" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 2,
				value: form.newsletterSubtext ?? "",
				onChange: (e) => set("newsletterSubtext", e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Social links JSON" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 5,
				value: form.socialLinksJson ?? "",
				onChange: (e) => set("socialLinksJson", e.target.value)
			})] })
		]
	});
}
//#endregion
export { CmsSettingsPage as component };
