import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, i as numberType, s as stringType, t as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-D6X_YLBH.js
var $$splitComponentImporter = () => import("./admin.inventory-Bu0x_An5.mjs");
var inventorySearchSchema = objectType({
	search: stringType().optional(),
	lowStock: booleanType().optional().catch(false),
	page: numberType().int().positive().optional().catch(1)
});
var Route = createFileRoute("/admin/inventory")({
	validateSearch: (search) => inventorySearchSchema.parse(search),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
