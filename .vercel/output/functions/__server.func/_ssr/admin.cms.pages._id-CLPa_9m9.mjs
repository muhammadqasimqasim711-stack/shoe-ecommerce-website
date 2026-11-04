import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./admin.cms.pages._id-BwzBgwok.mjs";
import { t as CmsPageForm } from "./cms-page-form-BnK64fJj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.pages._id-CLPa_9m9.js
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
