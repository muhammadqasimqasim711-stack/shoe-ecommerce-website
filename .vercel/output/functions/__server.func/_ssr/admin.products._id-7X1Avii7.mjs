import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./admin.products._id-BHat_YYR.mjs";
import { t as ProductForm } from "./product-form-2BvZhg3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products._id-7X1Avii7.js
var import_jsx_runtime = require_jsx_runtime();
function AdminProductDetailPage() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
		mode: "edit",
		productId: id
	});
}
//#endregion
export { AdminProductDetailPage as component };
