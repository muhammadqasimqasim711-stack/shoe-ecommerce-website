import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { H as GripVertical, T as Plus, d as Trash2 } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PageHeader } from "./page-header-D0DOsJrS.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Btj1C0as.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-form-2BvZhg3o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyVariant = () => ({
	size: "",
	color: "",
	material: "",
	sku: "",
	price: "",
	stock: "0"
});
function ProductForm({ mode, productId }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const isEdit = mode === "edit" && !!productId;
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"admin",
			"product",
			productId
		],
		queryFn: () => api.admin.product(productId),
		enabled: isEdit
	});
	const { data: brands = [] } = useQuery({
		queryKey: ["admin", "brands"],
		queryFn: () => api.admin.brands()
	});
	const { data: categories = [] } = useQuery({
		queryKey: ["admin", "categories"],
		queryFn: () => api.admin.categories()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [sku, setSku] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("0");
	const [compareAtPrice, setCompareAtPrice] = (0, import_react.useState)("");
	const [costPrice, setCostPrice] = (0, import_react.useState)("");
	const [brandId, setBrandId] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("");
	const [collection, setCollection] = (0, import_react.useState)("");
	const [categoryIds, setCategoryIds] = (0, import_react.useState)([]);
	const [isFeatured, setIsFeatured] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("DRAFT");
	const [images, setImages] = (0, import_react.useState)([{
		url: "",
		isMain: true
	}]);
	const [variants, setVariants] = (0, import_react.useState)([emptyVariant()]);
	const [lowStockThreshold, setLowStockThreshold] = (0, import_react.useState)("5");
	const [weight, setWeight] = (0, import_react.useState)("");
	const [length, setLength] = (0, import_react.useState)("");
	const [width, setWidth] = (0, import_react.useState)("");
	const [height, setHeight] = (0, import_react.useState)("");
	const [seoTitle, setSeoTitle] = (0, import_react.useState)("");
	const [seoDescription, setSeoDescription] = (0, import_react.useState)("");
	const [archiveOpen, setArchiveOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setName(String(data.name ?? ""));
		setSku(String(data.sku ?? ""));
		setDescription(String(data.description ?? ""));
		setPrice(String(data.price ?? "0"));
		setCompareAtPrice(data.compareAtPrice != null ? String(data.compareAtPrice) : "");
		setCostPrice(data.costPrice != null ? String(data.costPrice) : "");
		setBrandId(String(data.brandId ?? ""));
		setGender(String(data.gender ?? ""));
		setCollection(String(data.collection ?? ""));
		setCategoryIds(data.categoryIds ?? []);
		setIsFeatured(Boolean(data.isFeatured));
		setStatus(String(data.status ?? "DRAFT"));
		const imgs = data.images ?? [];
		setImages(imgs.length ? imgs.map((img, i) => ({
			id: img.id,
			url: img.url,
			altText: img.altText,
			isMain: img.isMain ?? i === 0,
			sortOrder: img.sortOrder ?? i
		})) : [{
			url: "",
			isMain: true
		}]);
		const vars = data.variants ?? [];
		setVariants(vars.length ? vars.map((v) => ({
			id: String(v.id),
			size: String(v.size ?? ""),
			color: String(v.color ?? ""),
			material: String(v.material ?? ""),
			sku: String(v.sku ?? ""),
			price: v.price != null ? String(v.price) : "",
			stock: String(v.stock ?? 0)
		})) : [emptyVariant()]);
		setLowStockThreshold(String(data.lowStockThreshold ?? 5));
		setWeight(data.weight != null ? String(data.weight) : "");
		setLength(data.length != null ? String(data.length) : "");
		setWidth(data.width != null ? String(data.width) : "");
		setHeight(data.height != null ? String(data.height) : "");
		setSeoTitle(String(data.seoTitle ?? ""));
		setSeoDescription(String(data.seoDescription ?? ""));
	}, [data]);
	function buildPayload(publishStatus) {
		const nextStatus = publishStatus ?? status;
		const cleanImages = images.filter((img) => img.url.trim()).map((img, i) => ({
			id: img.id,
			url: img.url.trim(),
			altText: img.altText,
			isMain: img.isMain ?? i === 0,
			sortOrder: i
		}));
		return {
			name: name.trim(),
			sku: sku.trim() || void 0,
			description,
			price: Number(price) || 0,
			compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
			costPrice: costPrice ? Number(costPrice) : null,
			brandId: brandId || null,
			gender: gender || void 0,
			collection: collection || null,
			categoryIds,
			isFeatured,
			status: nextStatus,
			isPublished: nextStatus === "ACTIVE",
			images: cleanImages,
			imageUrl: cleanImages[0]?.url,
			variants: variants.filter((v) => !v._delete).map((v) => ({
				id: v.id,
				size: v.size || void 0,
				color: v.color || void 0,
				material: v.material || void 0,
				sku: v.sku || void 0,
				price: v.price ? Number(v.price) : void 0,
				stock: Number(v.stock) || 0
			})),
			lowStockThreshold: Number(lowStockThreshold) || 0,
			weight: weight ? Number(weight) : null,
			length: length ? Number(length) : null,
			width: width ? Number(width) : null,
			height: height ? Number(height) : null,
			seoTitle: seoTitle || null,
			seoDescription: seoDescription || null
		};
	}
	const save = useMutation({
		mutationFn: async (publishStatus) => {
			const payload = buildPayload(publishStatus);
			if (isEdit) return api.admin.updateProduct(productId, payload);
			return api.admin.createProduct(payload);
		},
		onSuccess: (product, publishStatus) => {
			toast.success(publishStatus === "ACTIVE" ? "Product published" : "Product saved");
			queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
			if (isEdit) queryClient.invalidateQueries({ queryKey: [
				"admin",
				"product",
				productId
			] });
			else {
				const id = String(product.id ?? "");
				if (id) navigate({
					to: "/admin/products/$id",
					params: { id }
				});
				else navigate({ to: "/admin/products" });
			}
		},
		onError: () => toast.error("Could not save product")
	});
	const archive = useMutation({
		mutationFn: () => api.admin.archiveProduct(productId),
		onSuccess: () => {
			toast.success("Product archived");
			setArchiveOpen(false);
			queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
			queryClient.invalidateQueries({ queryKey: [
				"admin",
				"product",
				productId
			] });
		},
		onError: () => toast.error("Could not archive product")
	});
	function flatCategories(nodes, depth = 0) {
		const out = [];
		for (const n of nodes) {
			out.push({
				id: n.id,
				name: `${"— ".repeat(depth)}${n.name}`
			});
			if (Array.isArray(n.children) && n.children.length) out.push(...flatCategories(n.children, depth + 1));
		}
		return out;
	}
	if (isEdit && isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" });
	if (isEdit && (isError || !data)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-amber-600",
		children: "Product not found."
	});
	const categoryOptions = flatCategories(categories);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: isEdit ? "Edit product" : "Add product",
				backTo: "/admin/products",
				backLabel: "Products",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							disabled: save.isPending,
							onClick: () => save.mutate("DRAFT"),
							children: "Save draft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							disabled: save.isPending,
							onClick: () => save.mutate("ACTIVE"),
							children: "Publish"
						}),
						isEdit && status !== "ARCHIVED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "destructive",
							onClick: () => setArchiveOpen(true),
							children: "Archive"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-background p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Basic info"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SKU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sku,
								onChange: (e) => setSku(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: brandId,
								onChange: (e) => setBrandId(e.target.value),
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "No brand"
								}), brands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: b.id,
									children: b.name
								}, b.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: gender,
								onChange: (e) => setGender(e.target.value),
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Any"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "men",
										children: "Men"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "women",
										children: "Women"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "kids",
										children: "Kids"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "unisex",
										children: "Unisex"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Collection" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: collection,
								onChange: (e) => setCollection(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 4,
								value: description,
								onChange: (e) => setDescription(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categories" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-md border border-input p-3",
								children: [categoryOptions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: "No categories yet"
								}), categoryOptions.map((c) => {
									const checked = categoryIds.includes(c.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked,
											onChange: () => setCategoryIds((prev) => checked ? prev.filter((id) => id !== c.id) : [...prev, c.id])
										}), c.name]
									}, c.id);
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: isFeatured,
								onCheckedChange: setIsFeatured
							}), "Featured"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-background p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Pricing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								min: 0,
								value: price,
								onChange: (e) => setPrice(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Compare at" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								min: 0,
								value: compareAtPrice,
								onChange: (e) => setCompareAtPrice(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								min: 0,
								value: costPrice,
								onChange: (e) => setCostPrice(e.target.value)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-background p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Images"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => setImages((prev) => [...prev, {
							url: "",
							isMain: false
						}]),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Add URL"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: images.map((img, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 rounded-lg border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "min-w-[200px] flex-1",
								placeholder: "https://…",
								value: img.url,
								onChange: (e) => setImages((prev) => prev.map((row, i) => i === index ? {
									...row,
									url: e.target.value
								} : row))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "main-image",
									checked: !!img.isMain,
									onChange: () => setImages((prev) => prev.map((row, i) => ({
										...row,
										isMain: i === index
									})))
								}), "Main"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								disabled: index === 0,
								onClick: () => setImages((prev) => {
									const next = [...prev];
									[next[index - 1], next[index]] = [next[index], next[index - 1]];
									return next;
								}),
								children: "↑"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								onClick: () => setImages((prev) => prev.filter((_, i) => i !== index)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, index))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-background p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Variants"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: () => setVariants((p) => [...p, emptyVariant()]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Add variant"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: variants.map((v, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Size",
									value: v.size,
									onChange: (e) => setVariants((p) => p.map((row, i) => i === index ? {
										...row,
										size: e.target.value
									} : row))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Color",
									value: v.color,
									onChange: (e) => setVariants((p) => p.map((row, i) => i === index ? {
										...row,
										color: e.target.value
									} : row))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Material",
									value: v.material,
									onChange: (e) => setVariants((p) => p.map((row, i) => i === index ? {
										...row,
										material: e.target.value
									} : row))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "SKU",
									value: v.sku,
									onChange: (e) => setVariants((p) => p.map((row, i) => i === index ? {
										...row,
										sku: e.target.value
									} : row))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Price",
									type: "number",
									step: "0.01",
									value: v.price,
									onChange: (e) => setVariants((p) => p.map((row, i) => i === index ? {
										...row,
										price: e.target.value
									} : row))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Stock",
										type: "number",
										min: 0,
										value: v.stock,
										onChange: (e) => setVariants((p) => p.map((row, i) => i === index ? {
											...row,
											stock: e.target.value
										} : row))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "icon",
										variant: "ghost",
										onClick: () => setVariants((p) => p.filter((_, i) => i !== index)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							]
						}, v.id ?? index))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xs space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Low stock threshold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: lowStockThreshold,
							onChange: (e) => setLowStockThreshold(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-background p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Shipping dimensions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Weight" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: weight,
								onChange: (e) => setWeight(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Length" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: length,
								onChange: (e) => setLength(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Width" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: width,
								onChange: (e) => setWidth(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Height" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: height,
								onChange: (e) => setHeight(e.target.value)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-background p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "SEO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SEO title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: seoTitle,
							onChange: (e) => setSeoTitle(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SEO description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: seoDescription,
							onChange: (e) => setSeoDescription(e.target.value)
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: archiveOpen,
				onOpenChange: setArchiveOpen,
				title: "Archive this product?",
				description: "It will be hidden from the storefront but can be restored later.",
				confirmLabel: "Archive",
				destructive: true,
				loading: archive.isPending,
				onConfirm: () => archive.mutate()
			})
		]
	});
}
//#endregion
export { ProductForm as t };
