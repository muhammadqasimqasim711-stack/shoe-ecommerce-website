import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as ShoppingBag } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-storage-BIZ_cztO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LOCALE_STORAGE_KEY = "sole_locale";
var EUR_PER_USD = .92;
var DEFAULT_LOCALE = {
	language: "en",
	currency: "USD"
};
var MESSAGES = {
	en: {
		freeShipping: "Free shipping on orders over $75",
		help: "Help",
		quickAdd: "Quick Add",
		addToCart: "Add to Cart",
		cart: "Cart",
		wishlist: "Wishlist",
		searchPlaceholder: "Search sneakers, brands…",
		signIn: "Sign in",
		logOut: "Log out",
		adminCrm: "Admin CRM",
		paidInUsd: "Displayed in your currency; payment settles in USD.",
		new: "New",
		men: "Men",
		women: "Women",
		kids: "Kids",
		sale: "Sale",
		brands: "Brands",
		joinClub: "Join the Club.",
		subscribe: "Subscribe",
		checkout: "Checkout",
		yourBag: "Your bag",
		summary: "Summary",
		subtotal: "Subtotal",
		discount: "Discount",
		shipping: "Shipping",
		total: "Total",
		free: "Free",
		reviews: "Reviews",
		writeReview: "Write a review",
		signInToReview: "Sign in to review",
		inStock: "In stock",
		outOfStock: "Out of stock",
		aboutProduct: "About this product",
		size: "Size",
		color: "Color",
		shopRunning: "Shop Running",
		shopLifestyle: "Shop Lifestyle",
		noReviewsYet: "No reviews yet"
	},
	es: {
		freeShipping: "Envío gratis en pedidos superiores a $75",
		help: "Ayuda",
		quickAdd: "Añadir",
		addToCart: "Añadir al carrito",
		cart: "Carrito",
		wishlist: "Lista de deseos",
		searchPlaceholder: "Buscar zapatillas, marcas…",
		signIn: "Iniciar sesión",
		logOut: "Cerrar sesión",
		adminCrm: "CRM Admin",
		paidInUsd: "Mostrado en tu moneda; el pago se realiza en USD.",
		new: "Nuevo",
		men: "Hombre",
		women: "Mujer",
		kids: "Niños",
		sale: "Ofertas",
		brands: "Marcas",
		joinClub: "Únete al club.",
		subscribe: "Suscribirse",
		checkout: "Pagar",
		yourBag: "Tu bolsa",
		summary: "Resumen",
		subtotal: "Subtotal",
		discount: "Descuento",
		shipping: "Envío",
		total: "Total",
		free: "Gratis",
		reviews: "Reseñas",
		writeReview: "Escribir una reseña",
		signInToReview: "Inicia sesión para opinar",
		inStock: "En stock",
		outOfStock: "Agotado",
		aboutProduct: "Sobre este producto",
		size: "Talla",
		color: "Color",
		shopRunning: "Comprar Running",
		shopLifestyle: "Comprar Lifestyle",
		noReviewsYet: "Aún no hay reseñas"
	}
};
function convertUsd(amountUsd, currency) {
	if (currency === "EUR") return amountUsd * EUR_PER_USD;
	return amountUsd;
}
function formatMoney(amountUsd, currency, round = false) {
	const value = convertUsd(amountUsd, currency);
	const amount = round ? Math.round(value) : value;
	return new Intl.NumberFormat(currency === "EUR" ? "es-ES" : "en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: round ? 0 : 2,
		maximumFractionDigits: round ? 0 : 2
	}).format(amount);
}
function translate(language, key) {
	return MESSAGES[language][key] ?? MESSAGES.en[key] ?? key;
}
function loadLocalePrefs() {
	if (typeof window === "undefined") return DEFAULT_LOCALE;
	try {
		const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
		if (!raw) return DEFAULT_LOCALE;
		const parsed = JSON.parse(raw);
		return {
			language: parsed.language === "es" ? "es" : "en",
			currency: parsed.currency === "EUR" ? "EUR" : "USD"
		};
	} catch {
		return DEFAULT_LOCALE;
	}
}
function saveLocalePrefs(prefs) {
	if (typeof window === "undefined") return;
	localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(prefs));
}
var LocaleContext = (0, import_react.createContext)(null);
function LocaleProvider({ children }) {
	const [prefs, setPrefs] = (0, import_react.useState)(DEFAULT_LOCALE);
	(0, import_react.useEffect)(() => {
		setPrefs(loadLocalePrefs());
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof document !== "undefined") document.documentElement.lang = prefs.language;
	}, [prefs.language]);
	const setLanguage = (0, import_react.useCallback)((language) => {
		setPrefs((prev) => {
			const next = {
				...prev,
				language
			};
			saveLocalePrefs(next);
			return next;
		});
	}, []);
	const setCurrency = (0, import_react.useCallback)((currency) => {
		setPrefs((prev) => {
			const next = {
				...prev,
				currency
			};
			saveLocalePrefs(next);
			return next;
		});
	}, []);
	const t = (0, import_react.useCallback)((key) => translate(prefs.language, key), [prefs.language]);
	const formatMoney$1 = (0, import_react.useCallback)((amountUsd, opts) => formatMoney(amountUsd, prefs.currency, opts?.round ?? false), [prefs.currency]);
	const value = (0, import_react.useMemo)(() => ({
		language: prefs.language,
		currency: prefs.currency,
		setLanguage,
		setCurrency,
		t,
		formatMoney: formatMoney$1
	}), [
		prefs.language,
		prefs.currency,
		setLanguage,
		setCurrency,
		t,
		formatMoney$1
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleContext.Provider, {
		value,
		children
	});
}
function useLocale() {
	const ctx = (0, import_react.useContext)(LocaleContext);
	if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
	return ctx;
}
var FlyCartContext = (0, import_react.createContext)({
	flyToCart: () => {},
	isCartBouncing: false,
	plusOneBadges: [],
	triggerCartImpact: () => {}
});
function FlyCartProvider({ children }) {
	const [flyingParticles, setFlyingParticles] = (0, import_react.useState)([]);
	const [isCartBouncing, setIsCartBouncing] = (0, import_react.useState)(false);
	const [plusOneBadges, setPlusOneBadges] = (0, import_react.useState)([]);
	const triggerCartImpact = (0, import_react.useCallback)(() => {
		setIsCartBouncing(true);
		const badgeId = `badge-${Date.now()}-${Math.random()}`;
		setPlusOneBadges((prev) => [...prev, { id: badgeId }]);
		setTimeout(() => {
			setIsCartBouncing(false);
		}, 600);
		setTimeout(() => {
			setPlusOneBadges((prev) => prev.filter((b) => b.id !== badgeId));
		}, 900);
	}, []);
	const flyToCart = (0, import_react.useCallback)((source, imageUrl) => {
		let startX = window.innerWidth / 2;
		let startY = window.innerHeight / 2;
		let detectedImg = imageUrl;
		if (source) {
			if ("getBoundingClientRect" in source) {
				const rect = source.getBoundingClientRect();
				startX = rect.left + rect.width / 2;
				startY = rect.top + rect.height / 2;
				if (!detectedImg && source instanceof HTMLElement) {
					const imgEl = source.querySelector("img");
					if (imgEl && imgEl.src) detectedImg = imgEl.src;
				}
			} else if ("clientX" in source) {
				const mouseEvent = source;
				startX = mouseEvent.clientX;
				startY = mouseEvent.clientY;
				if (!detectedImg && mouseEvent.currentTarget instanceof HTMLElement) {
					const imgEl = mouseEvent.currentTarget.querySelector("img");
					if (imgEl && imgEl.src) detectedImg = imgEl.src;
				}
			}
		}
		const cartTarget = document.querySelector("[data-cart-target]");
		let endX = window.innerWidth - 60;
		let endY = 40;
		if (cartTarget) {
			const cartRect = cartTarget.getBoundingClientRect();
			endX = cartRect.left + cartRect.width / 2;
			endY = cartRect.top + cartRect.height / 2;
		}
		const particleId = `particle-${Date.now()}-${Math.random()}`;
		setFlyingParticles((prev) => [...prev, {
			id: particleId,
			startX,
			startY,
			endX,
			endY,
			imgUrl: detectedImg
		}]);
		setTimeout(() => {
			triggerCartImpact();
			setFlyingParticles((prev) => prev.filter((p) => p.id !== particleId));
		}, 620);
	}, [triggerCartImpact]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FlyCartContext.Provider, {
		value: {
			flyToCart,
			isCartBouncing,
			plusOneBadges,
			triggerCartImpact
		},
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none fixed inset-0 z-[9999] overflow-hidden",
			children: flyingParticles.map((particle) => {
				const deltaX = particle.endX - particle.startX;
				const deltaY = particle.endY - particle.startY;
				const arcHeight = Math.min(Math.abs(deltaX) * .35 + 80, 200);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background border-2 border-accent shadow-2xl p-1 overflow-hidden",
					style: {
						left: `${particle.startX}px`,
						top: `${particle.startY}px`,
						animation: `flyArc-${particle.id} 0.62s cubic-bezier(0.2, 0.8, 0.25, 1) forwards`
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
                @keyframes flyArc-${particle.id} {
                  0% {
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    opacity: 1;
                  }
                  45% {
                    transform: translate(calc(-50% + ${deltaX * .4}px), calc(-50% + ${deltaY * .45 - arcHeight}px)) scale(0.85) rotate(180deg);
                    opacity: 0.95;
                  }
                  100% {
                    transform: translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.18) rotate(360deg);
                    opacity: 0;
                  }
                }
              ` }), particle.imgUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: particle.imgUrl,
						alt: "",
						className: "h-full w-full object-cover rounded-xl"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full w-full bg-accent text-accent-foreground grid place-items-center rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-6 w-6" })
					})]
				}, particle.id);
			})
		})]
	});
}
function useFlyCart() {
	return (0, import_react.useContext)(FlyCartContext);
}
var TOKEN_KEY = "sole_token";
var USER_KEY = "sole_user";
var inMemoryToken = null;
function getAuthToken() {
	if (typeof window === "undefined") return inMemoryToken;
	if (inMemoryToken) return inMemoryToken;
	const stored = localStorage.getItem(TOKEN_KEY);
	inMemoryToken = stored;
	return stored;
}
function setAuthToken(token) {
	inMemoryToken = token;
	if (typeof window !== "undefined") {
		localStorage.setItem(TOKEN_KEY, token);
		window.dispatchEvent(new Event("sole_token_changed"));
	}
}
function clearAuthToken() {
	inMemoryToken = null;
	if (typeof window !== "undefined") {
		localStorage.removeItem(TOKEN_KEY);
		window.dispatchEvent(new Event("sole_token_changed"));
	}
}
function getStoredUser() {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(USER_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function setStoredUser(user) {
	localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function clearStoredUser() {
	localStorage.removeItem(USER_KEY);
}
function clearAuth() {
	clearAuthToken();
	clearStoredUser();
}
//#endregion
export { getStoredUser as a, useFlyCart as c, getAuthToken as i, useLocale as l, LocaleProvider as n, setAuthToken as o, clearAuth as r, setStoredUser as s, FlyCartProvider as t };
