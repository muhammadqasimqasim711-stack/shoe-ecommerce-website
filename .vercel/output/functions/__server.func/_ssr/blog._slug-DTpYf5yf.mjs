import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as cmsDocumentHead } from "./cms-seo-Bd2I2Zdg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-DTpYf5yf.js
var $$splitComponentImporter = () => import("./blog._slug-DN7mO4oe.mjs");
var Route = createFileRoute("/blog/$slug")({
	head: ({ loaderData, params }) => cmsDocumentHead(loaderData, `${params.slug} — Journal — SOLE`, "Stories, drops, and news from SOLE."),
	loader: ({ context, params }) => context.queryClient.ensureQueryData({
		queryKey: [
			"cms",
			"blog",
			params.slug
		],
		queryFn: () => api.getCmsBlogPost(params.slug)
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
