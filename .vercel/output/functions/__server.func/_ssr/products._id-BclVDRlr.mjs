import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._id-BclVDRlr.js
var $$splitComponentImporter = () => import("./products._id-C1LlKzQo.mjs");
var Route = createFileRoute("/products/$id")({
	head: ({ loaderData, params }) => {
		const product = loaderData;
		const title = product?.name ? `${product.name} — SOLE Footwear` : "Product — SOLE";
		const description = product?.description?.slice(0, 160) || `Shop ${product?.name ?? "premium footwear"} online at SOLE. Free shipping over $75 with 30-day hassle-free returns.`;
		const image = product?.images?.[0]?.url || "";
		const structuredData = product ? {
			"@context": "https://schema.org/",
			"@type": "Product",
			name: product.name,
			image: image ? [image] : void 0,
			description: product.description || void 0,
			brand: product.brand ? {
				"@type": "Brand",
				name: product.brand.name
			} : void 0,
			offers: {
				"@type": "Offer",
				priceCurrency: "USD",
				price: Number(product.price) || 0,
				availability: "https://schema.org/InStock",
				url: `https://sole-shoes.vercel.app/products/${product.id}`
			}
		} : null;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:type",
					content: "product"
				},
				...image ? [{
					property: "og:image",
					content: image
				}] : [],
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: title
				},
				{
					name: "twitter:description",
					content: description
				},
				...image ? [{
					name: "twitter:image",
					content: image
				}] : []
			],
			scripts: structuredData ? [{
				type: "application/ld+json",
				children: JSON.stringify(structuredData)
			}] : []
		};
	},
	loader: ({ context, params }) => context.queryClient.ensureQueryData({
		queryKey: [
			"products",
			"detail",
			params.id
		],
		queryFn: () => api.getProduct(params.id)
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
