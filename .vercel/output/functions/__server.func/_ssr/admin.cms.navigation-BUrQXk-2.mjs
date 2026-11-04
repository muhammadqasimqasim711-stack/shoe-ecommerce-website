import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.navigation-BUrQXk-2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsNavPage() {
	const qc = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"nav"
		],
		queryFn: () => api.admin.cms.navigation()
	});
	const [menus, setMenus] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setMenus(data);
	}, [data]);
	const save = useMutation({
		mutationFn: (menu) => api.admin.cms.saveNavigation(menu.location, menu.items),
		onSuccess: () => {
			toast.success("Menu saved");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"nav"
			] });
			qc.invalidateQueries({ queryKey: ["cms", "nav"] });
		},
		onError: () => toast.error("Could not save menu")
	});
	const updateItem = (location, index, patch) => {
		setMenus((prev) => prev.map((m) => m.location === location ? {
			...m,
			items: m.items.map((it, i) => i === index ? {
				...it,
				...patch
			} : it)
		} : m));
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Navigation",
		description: "Header and footer menus shown on the storefront"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: menus.map((menu) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-border bg-background p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-semibold",
					children: [
						menu.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-normal text-muted-foreground",
							children: menu.location
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setMenus((prev) => prev.map((m) => m.location === menu.location ? {
							...m,
							items: [...m.items, {
								label: "New item",
								url: "/",
								sortOrder: m.items.length,
								enabled: true
							}]
						} : m)),
						children: "Add item"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => save.mutate(menu),
						disabled: save.isPending,
						children: "Save"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: menu.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: item.label,
							onChange: (e) => updateItem(menu.location, i, { label: e.target.value })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: item.url,
							onChange: (e) => updateItem(menu.location, i, { url: e.target.value }),
							className: "sm:col-span-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: item.enabled,
								onChange: (e) => updateItem(menu.location, i, { enabled: e.target.checked })
							}), "Enabled"]
						})
					]
				}, `${menu.location}-${i}`))
			})]
		}, menu.location))
	})] });
}
//#endregion
export { CmsNavPage as component };
