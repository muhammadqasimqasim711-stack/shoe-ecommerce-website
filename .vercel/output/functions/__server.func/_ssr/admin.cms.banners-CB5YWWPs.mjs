import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { t as StatusBadge } from "./status-badge-BFfSwLc6.mjs";
import { t as DataTable } from "./data-table-DsmvYkWL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.banners-CB5YWWPs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsBannersPage() {
	const qc = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"banners"
		],
		queryFn: () => api.admin.cms.banners()
	});
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		subtitle: "",
		desktopImageUrl: "",
		mobileImageUrl: "",
		buttonText: "Shop",
		buttonLink: "/shop",
		startsAt: "",
		endsAt: "",
		status: "DRAFT"
	});
	const create = useMutation({
		mutationFn: () => api.admin.cms.createBanner({
			...form,
			startsAt: form.startsAt || null,
			endsAt: form.endsAt || null
		}),
		onSuccess: () => {
			toast.success("Banner created");
			setForm({
				...form,
				title: "",
				subtitle: "",
				desktopImageUrl: ""
			});
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"banners"
			] });
		},
		onError: () => toast.error("Could not create banner")
	});
	const publish = useMutation({
		mutationFn: ({ id, on }) => on ? api.admin.cms.publishBanner(id) : api.admin.cms.unpublishBanner(id),
		onSuccess: () => {
			toast.success("Banner updated");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"banners"
			] });
			qc.invalidateQueries({ queryKey: ["cms", "banners"] });
		}
	});
	const remove = useMutation({
		mutationFn: () => api.admin.cms.deleteBanner(deleteId),
		onSuccess: () => {
			toast.success("Banner deleted");
			setDeleteId(null);
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"banners"
			] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Banners",
			description: "Promotional banners on the storefront"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-8 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-3",
			onSubmit: (e) => {
				e.preventDefault();
				create.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Title",
					value: form.title,
					onChange: (e) => setForm({
						...form,
						title: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Subtitle",
					value: form.subtitle,
					onChange: (e) => setForm({
						...form,
						subtitle: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					placeholder: "Desktop image URL",
					value: form.desktopImageUrl,
					onChange: (e) => setForm({
						...form,
						desktopImageUrl: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Mobile image URL",
					value: form.mobileImageUrl,
					onChange: (e) => setForm({
						...form,
						mobileImageUrl: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Button text",
					value: form.buttonText,
					onChange: (e) => setForm({
						...form,
						buttonText: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Button link",
					value: form.buttonLink,
					onChange: (e) => setForm({
						...form,
						buttonLink: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "datetime-local",
					value: form.startsAt,
					onChange: (e) => setForm({
						...form,
						startsAt: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "datetime-local",
					value: form.endsAt,
					onChange: (e) => setForm({
						...form,
						endsAt: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: create.isPending,
					children: "Add banner"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				"Title",
				"Status",
				"Link",
				"Actions"
			],
			loading: isLoading,
			isEmpty: !data.length,
			children: data.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: b.title || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: b.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3 text-muted-foreground",
						children: b.buttonLink
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => publish.mutate({
									id: b.id,
									on: b.status !== "PUBLISHED"
								}),
								children: b.status === "PUBLISHED" ? "Unpublish" : "Publish"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "destructive",
								onClick: () => setDeleteId(b.id),
								children: "Delete"
							})]
						})
					})
				]
			}, b.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: Boolean(deleteId),
			onOpenChange: (o) => !o && setDeleteId(null),
			title: "Delete this banner?",
			destructive: true,
			loading: remove.isPending,
			onConfirm: () => remove.mutate()
		})
	] });
}
//#endregion
export { CmsBannersPage as component };
