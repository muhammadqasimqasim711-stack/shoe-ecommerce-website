import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms-page-form-BnK64fJj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"DRAFT",
	"PUBLISHED",
	"SCHEDULED",
	"ARCHIVED"
];
function CmsPageForm({ mode, id }) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"page",
			id
		],
		queryFn: () => api.admin.cms.page(id),
		enabled: mode === "edit" && Boolean(id)
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("page");
	const [content, setContent] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("DRAFT");
	const [featuredImageUrl, setFeaturedImageUrl] = (0, import_react.useState)("");
	const [seoTitle, setSeoTitle] = (0, import_react.useState)("");
	const [seoDescription, setSeoDescription] = (0, import_react.useState)("");
	const [seoKeywords, setSeoKeywords] = (0, import_react.useState)("");
	const [canonicalUrl, setCanonicalUrl] = (0, import_react.useState)("");
	const [ogTitle, setOgTitle] = (0, import_react.useState)("");
	const [ogDescription, setOgDescription] = (0, import_react.useState)("");
	const [ogImage, setOgImage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setTitle(data.title);
		setSlug(data.slug);
		setType(data.type);
		setContent(data.content);
		setStatus(data.status);
		setFeaturedImageUrl(data.featuredImageUrl ?? "");
		setSeoTitle(data.seoTitle ?? "");
		setSeoDescription(data.seoDescription ?? "");
		setSeoKeywords(data.seoKeywords ?? "");
		setCanonicalUrl(data.canonicalUrl ?? "");
		setOgTitle(data.ogTitle ?? "");
		setOgDescription(data.ogDescription ?? "");
		setOgImage(data.ogImage ?? "");
	}, [data]);
	const payload = () => ({
		title,
		slug,
		type,
		content,
		status,
		featuredImageUrl: featuredImageUrl || null,
		seoTitle: seoTitle || null,
		seoDescription: seoDescription || null,
		seoKeywords: seoKeywords || null,
		canonicalUrl: canonicalUrl || null,
		ogTitle: ogTitle || null,
		ogDescription: ogDescription || null,
		ogImage: ogImage || null
	});
	const save = useMutation({
		mutationFn: () => mode === "create" ? api.admin.cms.createPage(payload()) : api.admin.cms.updatePage(id, payload()),
		onSuccess: () => {
			toast.success(mode === "create" ? "Page created" : "Page saved");
			qc.invalidateQueries({ queryKey: ["admin", "cms"] });
			navigate({ to: "/admin/cms/pages" });
		},
		onError: () => toast.error("Could not save page")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-6",
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: mode === "create" ? "Add page" : "Edit page",
				backTo: "/admin/cms/pages",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Slug",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: slug,
							onChange: (e) => setSlug(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: type,
							onChange: (e) => setType(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: status,
							onChange: (e) => setStatus(e.target.value),
							className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
							children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Content",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 12,
					value: content,
					onChange: (e) => setContent(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Featured image URL",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: featuredImageUrl,
					onChange: (e) => setFeaturedImageUrl(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "SEO"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "SEO title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: seoTitle,
						onChange: (e) => setSeoTitle(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Canonical URL",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: canonicalUrl,
						onChange: (e) => setCanonicalUrl(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "SEO description",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: seoDescription,
					onChange: (e) => setSeoDescription(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Keywords",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: seoKeywords,
					onChange: (e) => setSeoKeywords(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "OG title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: ogTitle,
						onChange: (e) => setOgTitle(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "OG image",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: ogImage,
						onChange: (e) => setOgImage(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "OG description",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: ogDescription,
					onChange: (e) => setOgDescription(e.target.value)
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { CmsPageForm as t };
