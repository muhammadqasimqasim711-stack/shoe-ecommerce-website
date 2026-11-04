import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./admin.cms.blog._id-C2ql6IJF.mjs";
import { t as CmsBlogForm } from "./cms-blog-form-CURhT25U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms.blog._id-CUYNj4sw.js
var import_jsx_runtime = require_jsx_runtime();
function EditBlog() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsBlogForm, {
		mode: "edit",
		id
	});
}
//#endregion
export { EditBlog as component };
