import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, i as numberType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.index-hjDPobRr.js
var $$splitComponentImporter = () => import("./admin.products.index-EXno1-LR.mjs");
var productSearchSchema = objectType({
	search: stringType().optional(),
	status: stringType().optional(),
	sort: stringType().optional(),
	page: numberType().int().positive().optional().catch(1)
});
var Route = createFileRoute("/admin/products/")({
	validateSearch: (search) => productSearchSchema.parse(search),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
