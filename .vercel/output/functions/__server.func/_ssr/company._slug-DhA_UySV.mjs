import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./api-qljhtqOX.mjs";
import { t as cmsDocumentHead } from "./cms-seo-Bd2I2Zdg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company._slug-DhA_UySV.js
var $$splitComponentImporter = () => import("./company._slug-h54eJnk2.mjs");
var Route = createFileRoute("/company/$slug")({
	head: ({ loaderData, params }) => cmsDocumentHead(loaderData, `${params.slug} — Company — SOLE`, `SOLE company: ${params.slug}`),
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
