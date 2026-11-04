import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms-html-RzYu_O3M.js
var import_jsx_runtime = require_jsx_runtime();
function CmsHtml({ html, className }) {
	if (!html) return null;
	if (!/<[a-z][\s\S]*>/i.test(html)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		style: { whiteSpace: "pre-wrap" },
		children: html
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		dangerouslySetInnerHTML: { __html: html }
	});
}
//#endregion
export { CmsHtml as t };
