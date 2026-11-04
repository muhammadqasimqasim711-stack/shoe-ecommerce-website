const CART_KEY = "sole_cart_id";

export function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_KEY);
}

export function setCartId(id: string) {
  localStorage.setItem(CART_KEY, id);
}

export function clearCartId() {
  localStorage.removeItem(CART_KEY);
}
