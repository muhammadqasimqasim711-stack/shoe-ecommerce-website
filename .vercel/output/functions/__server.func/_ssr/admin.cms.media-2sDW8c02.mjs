import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.media-2sDW8c02.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsMediaPage() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"media",
			search
		],
		queryFn: () => api.admin.cms.media(search || void 0)
	});
	const upload = useMutation({
		mutationFn: (file) => api.admin.cms.uploadMedia(file),
		onSuccess: () => {
			toast.success("Uploaded");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"media"
			] });
		},
		onError: () => toast.error("Upload failed")
	});
	const remove = useMutation({
		mutationFn: () => api.admin.cms.deleteMedia(deleteId),
		onSuccess: () => {
			toast.success("Deleted");
			setDeleteId(null);
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"media"
			] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Media library",
			description: "Upload images and copy URLs for banners, pages, and products"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: "Search files",
				className: "max-w-xs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "file",
				accept: "image/*",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) upload.mutate(file);
				}
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: data.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-border bg-background p-3",
				children: [
					m.mimeType.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: m.url,
						alt: m.altText ?? m.filename,
						className: "mb-2 h-32 w-full rounded object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 grid h-32 place-items-center rounded bg-muted text-xs",
						children: m.mimeType
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-sm font-medium",
						children: m.filename
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [Math.round(m.size / 1024), " KB"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								navigator.clipboard.writeText(m.url);
								toast.success("URL copied");
							},
							children: "Copy URL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: () => setDeleteId(m.id),
							children: "Delete"
						})]
					})
				]
			}, m.id))
		}),
		!isLoading && !data.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No media yet."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: Boolean(deleteId),
			onOpenChange: (o) => !o && setDeleteId(null),
			title: "Delete this file?",
			destructive: true,
			loading: remove.isPending,
			onConfirm: () => remove.mutate()
		})
	] });
}
//#endregion
export { CmsMediaPage as component };
