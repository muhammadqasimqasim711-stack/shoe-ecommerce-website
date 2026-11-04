const TOKEN_KEY = "sole_token";
const USER_KEY = "sole_user";

let inMemoryToken: string | null = null;

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return inMemoryToken;
  if (inMemoryToken) return inMemoryToken;
  const stored = localStorage.getItem(TOKEN_KEY);
  inMemoryToken = stored;
  return stored;
}

export function setAuthToken(token: string) {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event("sole_token_changed"));
  }
}

export function clearAuthToken() {
  inMemoryToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("sole_token_changed"));
  }
}

export function getStoredUser(): import("./types").AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as import("./types").AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: import("./types").AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
  clearAuthToken();
  clearStoredUser();
}
