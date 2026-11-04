import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders._orderId.confirmation-H5HvKwrw.js
var $$splitComponentImporter = () => import("./orders._orderId.confirmation-D0GynePA.mjs");
var Route = createFileRoute("/orders/$orderId/confirmation")({
	head: () => ({ meta: [{ title: "Order confirmed — SOLE" }, {
		name: "description",
		content: "Your SOLE order confirmation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
