import { t as cn } from "./utils-C_uf36nf.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { B as Heart } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as useWishlist } from "./site-header-yEx0p83x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-button-ByJ8nQQr.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistButton({ product, className }) {
	const { isSaved, toggleItem } = useWishlist();
	const saved = isSaved(product.id) || (product.defaultVariantId ? isSaved(product.defaultVariantId) : false);
	const handleClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!product.defaultVariantId) {
			toast.error("This product is not available yet.");
			return;
		}
		try {
			await toggleItem.mutateAsync(product.defaultVariantId);
			toast.success(saved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
		} catch {
			toast.error("Could not update wishlist. Is the backend running?");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": saved ? "Remove from wishlist" : "Save to wishlist",
		"aria-pressed": saved,
		disabled: toggleItem.isPending,
		onClick: handleClick,
		className: cn("h-9 w-9 rounded-full bg-background/90 backdrop-blur grid place-items-center transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50", saved && "bg-accent text-accent-foreground", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-4 w-4", saved && "fill-current") })
	});
}
//#endregion
export { WishlistButton as t };
