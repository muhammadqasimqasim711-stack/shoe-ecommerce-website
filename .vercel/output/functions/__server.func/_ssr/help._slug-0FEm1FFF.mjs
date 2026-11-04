import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as cmsDocumentHead } from "./cms-seo-Bd2I2Zdg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help._slug-0FEm1FFF.js
var $$splitComponentImporter = () => import("./help._slug-CUbiSD_g.mjs");
var Route = createFileRoute("/help/$slug")({
	head: ({ loaderData, params }) => cmsDocumentHead(loaderData, `${params.slug} — Help — SOLE`, `SOLE help: ${params.slug}`),
	loader: ({ context, params }) => context.queryClient.ensureQueryData({
		queryKey: [
			"cms",
			"page",
			params.slug
		],
		queryFn: () => api.getCmsPage(params.slug)
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
