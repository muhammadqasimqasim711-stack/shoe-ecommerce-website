import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, i as numberType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders.index-CNCcBAP2.js
var $$splitComponentImporter = () => import("./admin.orders.index-CthtSwDo.mjs");
var ordersSearchSchema = objectType({
	status: stringType().optional(),
	search: stringType().optional(),
	page: numberType().int().positive().optional().catch(1)
});
var Route = createFileRoute("/admin/orders/")({
	validateSearch: (search) => ordersSearchSchema.parse(search),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
