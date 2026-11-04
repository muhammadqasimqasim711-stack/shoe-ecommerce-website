import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.homepage-0HpOT-EJ.js
var import_jsx_runtime = require_jsx_runtime();
function CmsHomepagePage() {
	const qc = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"homepage"
		],
		queryFn: () => api.admin.cms.homepage()
	});
	const update = useMutation({
		mutationFn: ({ id, payload }) => api.admin.cms.updateHomepageSection(id, payload),
		onSuccess: () => {
			toast.success("Section saved");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"homepage"
			] });
			qc.invalidateQueries({ queryKey: ["cms", "home"] });
		},
		onError: () => toast.error("Could not save section")
	});
	const move = (index, dir) => {
		const next = [...data];
		const j = index + dir;
		if (j < 0 || j >= next.length) return;
		const tmp = next[index];
		next[index] = next[j];
		next[j] = tmp;
		api.admin.cms.reorderHomepage(next.map((s, i) => ({
			id: s.id,
			sortOrder: i
		}))).then(() => {
			toast.success("Order updated");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"homepage"
			] });
			qc.invalidateQueries({ queryKey: ["cms", "home"] });
		}).catch(() => toast.error("Could not reorder"));
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Homepage",
		description: "Edit copy, CTAs, and visibility for each homepage section"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: data.map((section, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl border border-border bg-background p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: section.key
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: section.status ?? "PUBLISHED" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `en-${section.id}`,
								className: "text-xs",
								children: "Enabled"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								id: `en-${section.id}`,
								checked: section.enabled !== false,
								onCheckedChange: (enabled) => update.mutate({
									id: section.id,
									payload: { enabled }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => move(i, -1),
							children: "Up"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => move(i, 1),
							children: "Down"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 8,
				defaultValue: JSON.stringify(section.payload ?? {}, null, 2),
				onBlur: (e) => {
					try {
						const payload = JSON.parse(e.target.value);
						update.mutate({
							id: section.id,
							payload: { payload }
						});
					} catch {
						toast.error("Invalid JSON");
					}
				}
			})]
		}, section.id))
	})] });
}
//#endregion
export { CmsHomepagePage as component };
