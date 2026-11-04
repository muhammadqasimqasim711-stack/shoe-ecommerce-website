import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, i as numberType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers.index-DfxeghPi.js
var $$splitComponentImporter = () => import("./admin.customers.index-CsQeNgXE.mjs");
var customerSearchSchema = objectType({
	search: stringType().optional(),
	segment: stringType().optional(),
	page: numberType().int().positive().optional().catch(1)
});
var Route = createFileRoute("/admin/customers/")({
	validateSearch: (search) => customerSearchSchema.parse(search),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
