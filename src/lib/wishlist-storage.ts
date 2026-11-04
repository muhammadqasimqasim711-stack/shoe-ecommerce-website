const WISHLIST_KEY = "sole_wishlist_id";

export function getWishlistId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(WISHLIST_KEY);
}

export function setWishlistId(id: string) {
  localStorage.setItem(WISHLIST_KEY, id);
}

export function clearWishlistId() {
  localStorage.removeItem(WISHLIST_KEY);
}
