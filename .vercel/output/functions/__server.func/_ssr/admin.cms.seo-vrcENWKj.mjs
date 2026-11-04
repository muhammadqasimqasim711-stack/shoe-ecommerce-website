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
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.seo-vrcENWKj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsSeoPage() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"settings"
		],
		queryFn: () => api.admin.cms.settings()
	});
	const [form, setForm] = (0, import_react.useState)({
		defaultSeoTitle: "",
		defaultSeoDescription: "",
		defaultOgImage: ""
	});
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setForm({
			defaultSeoTitle: data.defaultSeoTitle ?? "",
			defaultSeoDescription: data.defaultSeoDescription ?? "",
			defaultOgImage: data.defaultOgImage ?? ""
		});
	}, [data]);
	const save = useMutation({
		mutationFn: () => api.admin.cms.updateSettings(form),
		onSuccess: () => {
			toast.success("SEO defaults saved");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"settings"
			] });
			qc.invalidateQueries({ queryKey: ["cms", "settings"] });
		},
		onError: () => toast.error("Could not save SEO")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "max-w-2xl space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "SEO",
				description: "Default meta tags for the storefront. Pages and blog posts can override these.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Default title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.defaultSeoTitle,
				onChange: (e) => setForm({
					...form,
					defaultSeoTitle: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Default description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 4,
				value: form.defaultSeoDescription,
				onChange: (e) => setForm({
					...form,
					defaultSeoDescription: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Default Open Graph image URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.defaultOgImage,
				onChange: (e) => setForm({
					...form,
					defaultOgImage: e.target.value
				})
			})] })
		]
	});
}
//#endregion
export { CmsSeoPage as component };
