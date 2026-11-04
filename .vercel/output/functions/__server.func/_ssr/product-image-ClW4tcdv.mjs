import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-image-ClW4tcdv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_SHOE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80";
function ProductImage({ src, alt, className, width, height, loading = "lazy" }) {
	const resolved = src || FALLBACK_SHOE;
	const [current, setCurrent] = (0, import_react.useState)(resolved);
	(0, import_react.useEffect)(() => {
		setCurrent(resolved);
	}, [resolved]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: current,
		alt,
		width,
		height,
		loading,
		className,
		onError: () => {
			if (current !== FALLBACK_SHOE) setCurrent(FALLBACK_SHOE);
		}
	});
}
//#endregion
export { ProductImage as t };
