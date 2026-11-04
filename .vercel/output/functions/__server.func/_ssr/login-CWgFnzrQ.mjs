import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CWgFnzrQ.js
var $$splitComponentImporter = () => import("./login-EkrtVRSr.mjs");
var loginSearchSchema = objectType({ redirect: stringType().optional() });
var Route = createFileRoute("/login")({
	validateSearch: (search) => loginSearchSchema.parse(search),
	head: () => ({ meta: [{ title: "Sign In — SOLE" }, {
		name: "description",
		content: "Sign in to your SOLE account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
