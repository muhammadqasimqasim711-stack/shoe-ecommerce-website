import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms-blog-form-CURhT25U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CmsBlogForm({ mode, id }) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: [
			"admin",
			"cms",
			"blog",
			id
		],
		queryFn: () => api.admin.cms.blogPost(id),
		enabled: mode === "edit" && Boolean(id)
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [excerpt, setExcerpt] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [authorName, setAuthorName] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("DRAFT");
	const [featuredImageUrl, setFeaturedImageUrl] = (0, import_react.useState)("");
	const [seoTitle, setSeoTitle] = (0, import_react.useState)("");
	const [seoDescription, setSeoDescription] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setTitle(data.title);
		setSlug(data.slug);
		setExcerpt(data.excerpt ?? "");
		setContent(data.content ?? "");
		setAuthorName(data.authorName ?? "");
		setCategory(data.category ?? "");
		setTags((data.tags ?? []).join(", "));
		setStatus(data.status);
		setFeaturedImageUrl(data.featuredImageUrl ?? "");
		setSeoTitle(data.seoTitle ?? "");
		setSeoDescription(data.seoDescription ?? "");
	}, [data]);
	const payload = () => ({
		title,
		slug,
		excerpt,
		content,
		authorName,
		category,
		tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
		status,
		featuredImageUrl: featuredImageUrl || null,
		seoTitle: seoTitle || null,
		seoDescription: seoDescription || null
	});
	const save = useMutation({
		mutationFn: () => mode === "create" ? api.admin.cms.createBlog(payload()) : api.admin.cms.updateBlog(id, payload()),
		onSuccess: () => {
			toast.success("Post saved");
			qc.invalidateQueries({ queryKey: [
				"admin",
				"cms",
				"blog"
			] });
			navigate({ to: "/admin/cms/blog" });
		},
		onError: () => toast.error("Could not save post")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: mode === "create" ? "Add post" : "Edit post",
				backTo: "/admin/cms/blog",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: save.isPending,
					children: "Save"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: title,
						onChange: (e) => setTitle(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: slug,
						onChange: (e) => setSlug(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Author" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: authorName,
						onChange: (e) => setAuthorName(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: category,
						onChange: (e) => setCategory(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tags (comma separated)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tags,
						onChange: (e) => setTags(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "DRAFT" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PUBLISHED" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "SCHEDULED" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ARCHIVED" })
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Excerpt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 2,
				value: excerpt,
				onChange: (e) => setExcerpt(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Content" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 12,
				value: content,
				onChange: (e) => setContent(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Featured image URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: featuredImageUrl,
				onChange: (e) => setFeaturedImageUrl(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SEO title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: seoTitle,
				onChange: (e) => setSeoTitle(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SEO description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 2,
				value: seoDescription,
				onChange: (e) => setSeoDescription(e.target.value)
			})] })
		]
	});
}
//#endregion
export { CmsBlogForm as t };
