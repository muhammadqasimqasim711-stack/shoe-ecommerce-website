import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as cmsDocumentHead } from "./cms-seo-Bd2I2Zdg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal._slug-ChQDUhV7.js
var $$splitComponentImporter = () => import("./legal._slug-BmsDSfHX.mjs");
var Route = createFileRoute("/legal/$slug")({
	head: ({ loaderData, params }) => cmsDocumentHead(loaderData, `${params.slug} — Legal — SOLE`, `SOLE legal: ${params.slug}`),
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
