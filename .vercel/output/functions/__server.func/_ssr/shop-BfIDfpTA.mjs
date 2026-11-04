import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { a as objectType, n as enumType, o as preprocessType, r as literalType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-BfIDfpTA.js
function shopTitle(search, categoryName) {
	if (search.collection === "summer-26") return "Summer '26";
	if (search.onSale === "true") return "Sale";
	if (search.gender === "men") return "Men";
	if (search.gender === "women") return "Women";
	if (search.gender === "kids") return "Kids";
	if (search.sort === "newest" || search.days) return "New Arrivals";
	if (search.brand) return search.brand;
	if (search.category) return categoryName ?? titleCase(search.category);
	if (search.search) return `Results for “${search.search}”`;
	return "Shop";
}
function titleCase(value) {
	return value.replace(/\b\w/g, (c) => c.toUpperCase());
}
var $$splitComponentImporter = () => import("./shop-C2UprQAE.mjs");
function optionalOnSale(value) {
	if (value === true || value === "true" || value === 1 || value === "1") return "true";
}
function optionalDays(value) {
	if (value == null || value === "") return void 0;
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n) || n < 1) return void 0;
	return String(Math.trunc(n));
}
var shopSearchSchema = objectType({
	gender: enumType([
		"men",
		"women",
		"kids",
		"unisex"
	]).optional(),
	onSale: preprocessType(optionalOnSale, literalType("true").optional()),
	sort: enumType([
		"newest",
		"price_asc",
		"price_desc",
		"trending"
	]).optional(),
	days: preprocessType(optionalDays, stringType().optional()),
	brand: stringType().optional(),
	category: stringType().optional(),
	search: stringType().optional(),
	collection: stringType().optional()
});
function parseShopSearch(search) {
	const result = shopSearchSchema.safeParse(search);
	if (result.success) return result.data;
	const raw = search ?? {};
	return {
		onSale: optionalOnSale(raw.onSale),
		days: optionalDays(raw.days),
		sort: raw.sort === "newest" || raw.sort === "price_asc" || raw.sort === "price_desc" || raw.sort === "trending" ? raw.sort : void 0,
		gender: raw.gender === "men" || raw.gender === "women" || raw.gender === "kids" || raw.gender === "unisex" ? raw.gender : void 0,
		brand: typeof raw.brand === "string" ? raw.brand : void 0,
		category: typeof raw.category === "string" ? raw.category : void 0,
		search: typeof raw.search === "string" ? raw.search : void 0,
		collection: typeof raw.collection === "string" ? raw.collection : void 0
	};
}
function toProductParams(filters) {
	const params = { limit: 100 };
	if (filters.gender) params.gender = filters.gender;
	if (filters.onSale === "true") params.onSale = true;
	if (filters.sort) params.sort = filters.sort;
	if (filters.days) params.days = Number(filters.days);
	if (filters.brand) params.brand = filters.brand;
	if (filters.category) params.category = filters.category;
	if (filters.search) params.search = filters.search;
	if (filters.collection) params.collection = filters.collection;
	return params;
}
var Route = createFileRoute("/shop")({
	validateSearch: (search) => parseShopSearch(search),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		const params = toProductParams(deps);
		await Promise.all([
			context.queryClient.ensureQueryData({
				queryKey: [
					"products",
					"shop",
					deps
				],
				queryFn: () => api.getProducts(params)
			}),
			context.queryClient.ensureQueryData({
				queryKey: ["brands"],
				queryFn: () => api.getBrands()
			}),
			context.queryClient.ensureQueryData({
				queryKey: ["categories"],
				queryFn: () => api.getCategories()
			})
		]);
	},
	head: ({ match }) => {
		const search = match.search;
		const title = shopTitle(search ?? {});
		return { meta: [{ title: `${title} — SOLE` }, {
			name: "description",
			content: `Shop ${title.toLowerCase()} sneakers and footwear at SOLE.`
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { shopTitle as n, Route as t };
