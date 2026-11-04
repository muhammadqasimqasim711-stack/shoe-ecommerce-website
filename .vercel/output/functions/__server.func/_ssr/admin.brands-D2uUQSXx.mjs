import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.brands-D2uUQSXx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminBrandsPage() {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["admin", "brands"],
		queryFn: () => api.admin.brands()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: () => api.admin.createBrand({
			name: name.trim(),
			description: description.trim() || void 0
		}),
		onSuccess: () => {
			toast.success("Brand created");
			setName("");
			setDescription("");
			queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
		},
		onError: () => toast.error("Could not create brand (name may already exist)")
	});
	const update = useMutation({
		mutationFn: ({ id, description: desc }) => api.admin.updateBrand(id, { description: desc }),
		onSuccess: () => {
			toast.success("Brand updated");
			queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
		},
		onError: () => toast.error("Could not update brand")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black tracking-tight",
				children: "Brands"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					if (!name.trim()) return;
					create.mutate();
				},
				className: "flex flex-wrap gap-3 rounded-xl border border-border bg-background p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Brand name",
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "max-w-xs",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Description",
						value: description,
						onChange: (e) => setDescription(e.target.value),
						className: "max-w-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: create.isPending,
						className: "rounded-full",
						children: "Add brand"
					})
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-background overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-left text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 font-medium",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 font-medium",
								children: "Products"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 font-medium",
								children: "Description"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-medium",
								children: b.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: b.productCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									defaultValue: b.description ?? "",
									className: "max-w-md",
									onBlur: (e) => {
										const next = e.target.value;
										if (next !== (b.description ?? "")) update.mutate({
											id: b.id,
											description: next
										});
									}
								})
							})
						]
					}, b.id)) })]
				})
			})
		]
	});
}
//#endregion
export { AdminBrandsPage as component };
