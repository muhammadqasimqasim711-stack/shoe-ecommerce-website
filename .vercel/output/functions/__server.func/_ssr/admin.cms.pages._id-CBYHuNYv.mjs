import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./admin.cms.pages._id-CnitYR2G.mjs";
import { t as CmsPageForm } from "./cms-page-form-D6UlYJ0j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.pages._id-CBYHuNYv.js
var import_jsx_runtime = require_jsx_runtime();
function CmsPageEdit() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsPageForm, {
		mode: "edit",
		id
	});
}
//#endregion
export { CmsPageEdit as component };
