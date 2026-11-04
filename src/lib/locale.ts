export type Language = "en" | "es";
export type Currency = "USD" | "EUR";

export type LocalePrefs = {
  language: Language;
  currency: Currency;
};

export const LOCALE_STORAGE_KEY = "sole_locale";
export const EUR_PER_USD = 0.92;

export const DEFAULT_LOCALE: LocalePrefs = {
  language: "en",
  currency: "USD",
};

export type MessageKey =
  | "freeShipping"
  | "help"
  | "quickAdd"
  | "addToCart"
  | "cart"
  | "wishlist"
  | "searchPlaceholder"
  | "signIn"
  | "logOut"
  | "adminCrm"
  | "paidInUsd"
  | "new"
  | "men"
  | "women"
  | "kids"
  | "sale"
  | "brands"
  | "joinClub"
  | "subscribe"
  | "checkout"
  | "yourBag"
  | "summary"
  | "subtotal"
  | "discount"
  | "shipping"
  | "total"
  | "free"
  | "reviews"
  | "writeReview"
  | "signInToReview"
  | "inStock"
  | "outOfStock"
  | "aboutProduct"
  | "size"
  | "color"
  | "shopRunning"
  | "shopLifestyle"
  | "noReviewsYet";

const en: Record<MessageKey, string> = {
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
  noReviewsYet: "No reviews yet",
};

const es: Record<MessageKey, string> = {
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
  noReviewsYet: "Aún no hay reseñas",
};

export const MESSAGES: Record<Language, Record<MessageKey, string>> = { en, es };

export function convertUsd(amountUsd: number, currency: Currency): number {
  if (currency === "EUR") return amountUsd * EUR_PER_USD;
  return amountUsd;
}

export function formatMoney(amountUsd: number, currency: Currency, round = false): string {
  const value = convertUsd(amountUsd, currency);
  const amount = round ? Math.round(value) : value;
  return new Intl.NumberFormat(currency === "EUR" ? "es-ES" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: round ? 0 : 2,
    maximumFractionDigits: round ? 0 : 2,
  }).format(amount);
}

export function translate(language: Language, key: MessageKey): string {
  return MESSAGES[language][key] ?? MESSAGES.en[key] ?? key;
}

export function loadLocalePrefs(): LocalePrefs {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!raw) return DEFAULT_LOCALE;
    const parsed = JSON.parse(raw) as Partial<LocalePrefs>;
    const language: Language = parsed.language === "es" ? "es" : "en";
    const currency: Currency = parsed.currency === "EUR" ? "EUR" : "USD";
    return { language, currency };
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function saveLocalePrefs(prefs: LocalePrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(prefs));
}
