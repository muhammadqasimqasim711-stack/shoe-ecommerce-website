import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Star } from "../_libs/lucide-react.mjs";
import { n as api, t as ApiError } from "./api-qljhtqOX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useFlyCart, l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { c as useCart, n as SiteHeader, o as useAuth } from "./site-header-yEx0p83x.mjs";
import { t as ProductImage } from "./product-image-ClW4tcdv.mjs";
import { t as Route } from "./products._id-BQDK0T9h.mjs";
import { t as WishlistButton } from "./wishlist-button-ByJ8nQQr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._id-XejkltDg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StarRow({ rating, size = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-0.5",
		children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `${size} ${i < rating ? "fill-accent text-accent" : "text-muted-foreground/40"}` }, i))
	});
}
function isLightColor(color) {
	const c = color.trim().toLowerCase();
	return c === "#fff" || c === "#ffffff" || c === "white";
}
function imageIndexForColor(images, color, colorList) {
	if (!color) return 0;
	const byAlt = images.findIndex((img) => img.altText === color);
	if (byAlt >= 0) return byAlt;
	const byList = colorList.indexOf(color);
	return byList >= 0 ? byList : 0;
}
function ProductDetailPage() {
	const { id } = Route.useParams();
	const { addItem } = useCart();
	const { flyToCart } = useFlyCart();
	const { isAuthenticated } = useAuth();
	const { t, formatMoney } = useLocale();
	const queryClient = useQueryClient();
	const { data: product, isLoading, isError } = useQuery({
		queryKey: [
			"products",
			"detail",
			id
		],
		queryFn: () => api.getProduct(id),
		staleTime: 6e4
	});
	const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
		queryKey: [
			"reviews",
			"product",
			id
		],
		queryFn: () => api.getReviews({
			productId: id,
			limit: 50
		}),
		staleTime: 3e4
	});
	const [activeImage, setActiveImage] = (0, import_react.useState)(0);
	const [selectedSize, setSelectedSize] = (0, import_react.useState)(null);
	const [selectedColor, setSelectedColor] = (0, import_react.useState)(null);
	const [reviewRating, setReviewRating] = (0, import_react.useState)(5);
	const [reviewTitle, setReviewTitle] = (0, import_react.useState)("");
	const [reviewComment, setReviewComment] = (0, import_react.useState)("");
	const sizes = (0, import_react.useMemo)(() => {
		if (!product) return [];
		return [...new Set(product.variants.map((v) => v.size).filter((s) => Boolean(s && s !== "Default")))];
	}, [product]);
	const colors = (0, import_react.useMemo)(() => {
		if (!product) return [];
		return [...new Set(product.variants.map((v) => v.color).filter((c) => Boolean(c && c !== "Default")))];
	}, [product]);
	(0, import_react.useEffect)(() => {
		if (!product) return;
		const sizeOpts = [...new Set(product.variants.map((v) => v.size).filter((s) => Boolean(s && s !== "Default")))];
		const colorOpts = [...new Set(product.variants.map((v) => v.color).filter((c) => Boolean(c && c !== "Default")))];
		const first = product.variants.find((v) => v.stock > 0) ?? product.variants[0] ?? null;
		const nextSize = first?.size && first.size !== "Default" ? first.size : sizeOpts[0] ?? null;
		const nextColor = first?.color && first.color !== "Default" ? first.color : colorOpts[0] ?? null;
		setSelectedSize(nextSize);
		setSelectedColor(nextColor);
		setActiveImage(imageIndexForColor(product.images, nextColor, colorOpts));
	}, [product]);
	const selectColor = (color) => {
		setSelectedColor(color);
		if (product) setActiveImage(imageIndexForColor(product.images, color, colors));
	};
	const selectedVariant = (0, import_react.useMemo)(() => {
		if (!product?.variants.length) return null;
		return product.variants.find((v) => {
			const sizeOk = !selectedSize || !v.size || v.size === "Default" || v.size === selectedSize;
			const colorOk = !selectedColor || !v.color || v.color === "Default" || v.color === selectedColor;
			return sizeOk && colorOk;
		}) ?? product.variants[0] ?? null;
	}, [
		product,
		selectedSize,
		selectedColor
	]);
	const price = product ? Number(product.card.price ?? product.price) : 0;
	const oldPrice = product?.card.oldPrice;
	const inStock = (selectedVariant?.stock ?? 0) > 0;
	const displayRating = reviews.length > 0 ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10 : product?.card.rating ?? 0;
	const displayCount = reviews.length > 0 ? reviews.length : product?.card.reviewCount ?? 0;
	const createReview = useMutation({
		mutationFn: () => api.createReview(id, {
			rating: reviewRating,
			title: reviewTitle.trim() || void 0,
			comment: reviewComment.trim() || void 0
		}),
		onSuccess: async () => {
			toast.success("Thanks for your review!");
			setReviewTitle("");
			setReviewComment("");
			setReviewRating(5);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [
					"reviews",
					"product",
					id
				] }),
				queryClient.invalidateQueries({ queryKey: [
					"products",
					"detail",
					id
				] }),
				queryClient.invalidateQueries({ queryKey: ["reviews"] })
			]);
		},
		onError: (err) => {
			if (err instanceof ApiError && err.status === 409) {
				toast.error("You have already reviewed this product.");
				return;
			}
			if (err instanceof ApiError && err.status === 401) {
				toast.error("Please sign in to leave a review.");
				return;
			}
			toast.error("Could not submit review. Is the backend running?");
		}
	});
	const handleAddToCart = async (e) => {
		if (e && product) {
			const activeImgUrl = product.images[activeImage]?.url ?? product.card.img;
			flyToCart(e.currentTarget, activeImgUrl);
		}
		if (!selectedVariant) {
			toast.error("This product is not available yet.");
			return;
		}
		if (!inStock) {
			toast.error("Selected size is out of stock.");
			return;
		}
		try {
			await addItem.mutateAsync(selectedVariant.id);
			toast.success(`${product.name} added to cart`);
		} catch {
			toast.error("Could not add to cart. Is the backend running?");
		}
	};
	const onSubmitReview = (e) => {
		e.preventDefault();
		createReview.mutate();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-4 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs uppercase tracking-widest text-accent font-semibold mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:underline",
						children: "Home"
					}),
					" ",
					"/",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "hover:underline",
						children: "Shop"
					}),
					" ",
					"/ ",
					product?.name ?? "Product"
				]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-24" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-3/4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-32" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })
					]
				})]
			}) : isError || !product ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black tracking-tighter mb-3",
						children: "Product not found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mb-6",
						children: "This product may be unavailable."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: "Back to shop"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-10 lg:gap-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl bg-muted aspect-square mb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
							src: product.images[activeImage]?.url ?? product.card.img,
							alt: product.images[activeImage]?.altText ?? product.name,
							className: "h-full w-full object-cover"
						}),
						product.card.tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: `absolute top-4 left-4 rounded-full px-3 ${product.card.tag.startsWith("-") ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`,
							children: product.card.tag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistButton, {
							product: product.card,
							className: "absolute top-4 right-4"
						})
					]
				}), product.images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto",
					children: product.images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveImage(i),
						className: `h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${i === activeImage ? "border-accent" : "border-transparent"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
							src: img.url,
							alt: img.altText ?? `${product.name} ${i + 1}`,
							className: "h-full w-full object-cover"
						})
					}, img.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
						children: product.brand?.name ?? product.card.brand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl font-black tracking-tighter mb-3",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm text-muted-foreground mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-accent text-accent" }), displayCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							displayRating,
							" (",
							displayCount,
							" ",
							t("reviews").toLowerCase(),
							")"
						] }) : t("noReviewsYet")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-3 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-bold",
							children: formatMoney(price, { round: true })
						}), oldPrice != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg text-muted-foreground line-through",
							children: formatMoney(oldPrice, { round: true })
						})]
					}),
					sizes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold mb-3",
							children: t("size")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: sizes.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedSize(size),
								className: `min-w-12 h-11 px-3 rounded-full border text-sm font-medium transition ${selectedSize === size ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`,
								children: size
							}, size))
						})]
					}),
					colors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold mb-3",
							children: t("color")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: colors.map((color) => {
								const isHex = color.startsWith("#");
								const light = isLightColor(color);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => selectColor(color),
									"aria-label": color,
									title: color,
									className: `h-10 w-10 rounded-full border-2 transition ${selectedColor === color ? "border-accent scale-110" : "border-border"} ${light ? "ring-1 ring-black/30" : ""}`,
									style: isHex ? { background: color } : void 0,
									children: !isHex && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-medium",
										children: color
									})
								}, color);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mb-6",
						children: [
							inStock ? t("inStock") : t("outOfStock"),
							selectedVariant?.size ? ` · ${t("size")} ${selectedVariant.size}` : "",
							selectedVariant?.color && selectedVariant.color !== "Default" ? ` · ${selectedVariant.color}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "rounded-full w-full sm:w-auto min-w-48",
						disabled: addItem.isPending || !selectedVariant || !inStock,
						onClick: handleAddToCart,
						children: addItem.isPending ? "…" : t("addToCart")
					}),
					product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 pt-8 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold mb-3",
							children: t("aboutProduct")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground leading-relaxed whitespace-pre-wrap",
							children: product.description
						})]
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 pt-12 border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-black tracking-tighter mb-2",
						children: t("reviews")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mb-8",
						children: displayCount > 0 ? `${displayRating} average · ${displayCount} review${displayCount === 1 ? "" : "s"}` : "Be the first to review this product."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid lg:grid-cols-[1fr_340px] gap-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: reviewsLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i)) : reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground py-6",
								children: "No reviews yet."
							}) : reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-2xl border border-border bg-card p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm",
											children: r.authorName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: new Date(r.createdAt).toLocaleDateString()
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRow, { rating: r.rating })]
									}),
									r.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold mb-1",
										children: r.title
									}),
									r.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground leading-relaxed",
										children: r.comment
									})
								]
							}, r.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "rounded-2xl border border-border bg-muted/30 p-6 h-fit",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold mb-4",
								children: t("writeReview")
							}), isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: onSubmitReview,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm mb-2",
										children: "Your rating"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1",
										children: Array.from({ length: 5 }).map((_, i) => {
											const value = i + 1;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `${value} stars`,
												onClick: () => setReviewRating(value),
												className: "p-0.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-6 w-6 ${value <= reviewRating ? "fill-accent text-accent" : "text-muted-foreground/40"}` })
											}, value);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Title (optional)",
										value: reviewTitle,
										onChange: (e) => setReviewTitle(e.target.value),
										maxLength: 120
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										placeholder: "Share your experience (optional)",
										value: reviewComment,
										onChange: (e) => setReviewComment(e.target.value),
										rows: 4,
										maxLength: 2e3,
										className: "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "rounded-full w-full",
										disabled: createReview.isPending,
										children: createReview.isPending ? "Submitting…" : "Submit review"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Sign in to share your experience with this product."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "rounded-full w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										children: t("signInToReview")
									})
								})]
							})]
						})]
					})
				]
			})] })]
		})]
	});
}
//#endregion
export { ProductDetailPage as component };
