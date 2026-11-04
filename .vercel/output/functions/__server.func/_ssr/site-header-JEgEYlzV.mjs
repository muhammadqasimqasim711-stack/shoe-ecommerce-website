import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { B as Heart, P as LogOut, S as Search, a as User, j as Menu, n as X, v as ShoppingBag } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as isStaffRole } from "./types-BdW_FQEI.mjs";
import { a as getStoredUser, c as useFlyCart, i as getAuthToken, l as useLocale, o as setAuthToken, r as clearAuth, s as setStoredUser } from "./auth-storage-BIZ_cztO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-header-JEgEYlzV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LocaleSwitcher({ className, variant = "bar" }) {
	const { language, currency, setLanguage, setCurrency } = useLocale();
	const [open, setOpen] = (0, import_react.useState)(false);
	const label = `${language.toUpperCase()} / ${currency}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-expanded": open,
			"aria-haspopup": "dialog",
			onClick: () => setOpen((o) => !o),
			className: cn("hover:text-accent transition text-left", variant === "header" && "rounded-full border border-border px-2.5 py-1 text-xs font-medium hover:border-accent"),
			children: label
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			className: "fixed inset-0 z-40 cursor-default",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			className: "absolute right-0 z-50 mt-2 w-44 rounded-xl border border-border bg-background p-3 shadow-lg text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs text-muted-foreground mb-1",
					children: "Language"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: language,
					onChange: (e) => setLanguage(e.target.value),
					className: "mb-3 h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "en",
						children: "EN — English"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "es",
						children: "ES — Español"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs text-muted-foreground mb-1",
					children: "Currency"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: currency,
					onChange: (e) => setCurrency(e.target.value),
					className: "h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "USD",
						children: "USD"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "EUR",
						children: "EUR"
					})]
				})
			]
		})] })]
	});
}
function persistAuth(res) {
	setAuthToken(res.accessToken);
	setStoredUser(res.user);
}
function toAuthUser(profile) {
	const role = typeof profile.role === "string" ? profile.role : profile.role?.name ?? "CUSTOMER";
	return {
		id: profile.id,
		email: profile.email,
		firstName: profile.firstName,
		lastName: profile.lastName,
		role
	};
}
function useAuth() {
	const queryClient = useQueryClient();
	const [token, setTokenState] = (0, import_react.useState)(null);
	const [cachedUser, setCachedUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const syncAuth = () => {
			setTokenState(getAuthToken());
			setCachedUser(getStoredUser());
		};
		syncAuth();
		if (typeof window !== "undefined") {
			window.addEventListener("sole_token_changed", syncAuth);
			window.addEventListener("storage", syncAuth);
			return () => {
				window.removeEventListener("sole_token_changed", syncAuth);
				window.removeEventListener("storage", syncAuth);
			};
		}
	}, []);
	const meQuery = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			try {
				const user = toAuthUser(await api.me());
				setStoredUser(user);
				setCachedUser(user);
				return user;
			} catch (err) {
				if (err instanceof Error && "status" in err && err.status === 401) {
					clearAuth();
					setTokenState(null);
					setCachedUser(null);
					queryClient.removeQueries({ queryKey: ["auth"] });
				}
				throw err;
			}
		},
		enabled: Boolean(token),
		staleTime: 6e4,
		retry: false
	});
	const login = useMutation({
		mutationFn: ({ email, password }) => api.login(email, password),
		onSuccess: (res) => {
			persistAuth(res);
			setTokenState(res.accessToken);
			setCachedUser(res.user);
			queryClient.setQueryData(["auth", "me"], res.user);
		}
	});
	const register = useMutation({
		mutationFn: (payload) => api.register(payload),
		onSuccess: (res) => {
			persistAuth(res);
			setTokenState(res.accessToken);
			setCachedUser(res.user);
			queryClient.setQueryData(["auth", "me"], res.user);
		}
	});
	const logout = () => {
		clearAuth();
		setTokenState(null);
		setCachedUser(null);
		queryClient.removeQueries({ queryKey: ["auth"] });
	};
	const user = meQuery.data ?? cachedUser;
	return {
		user,
		isAuthenticated: Boolean(token && user),
		isLoading: Boolean(token) && meQuery.isLoading,
		login,
		register,
		logout
	};
}
var CART_KEY = "sole_cart_id";
function getCartId() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(CART_KEY);
}
function setCartId(id) {
	localStorage.setItem(CART_KEY, id);
}
function clearCartId() {
	localStorage.removeItem(CART_KEY);
}
var WISHLIST_KEY = "sole_wishlist_id";
function getWishlistId() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(WISHLIST_KEY);
}
function setWishlistId(id) {
	localStorage.setItem(WISHLIST_KEY, id);
}
function useHomeCatalog() {
	return useQuery({
		queryKey: ["catalog", "home"],
		queryFn: () => api.getHomeCatalog(),
		staleTime: 6e4,
		retry: 1
	});
}
function useShopProducts(filters) {
	const params = { limit: 100 };
	if (filters.gender) params.gender = filters.gender;
	if (filters.onSale === "true") params.onSale = true;
	if (filters.sort) params.sort = filters.sort;
	if (filters.days) params.days = Number(filters.days);
	if (filters.brand) params.brand = filters.brand;
	if (filters.category) params.category = filters.category;
	if (filters.search) params.search = filters.search;
	if (filters.collection) params.collection = filters.collection;
	return useQuery({
		queryKey: [
			"products",
			"shop",
			filters
		],
		queryFn: () => api.getProducts(params),
		staleTime: 3e4,
		retry: 1
	});
}
function useBrands() {
	return useQuery({
		queryKey: ["brands"],
		queryFn: () => api.getBrands(),
		staleTime: 6e4
	});
}
function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => api.getCategories(),
		staleTime: 6e4
	});
}
function useCart() {
	const queryClient = useQueryClient();
	const [cartId, setCartIdState] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setCartIdState(getCartId());
	}, []);
	const cartQuery = useQuery({
		queryKey: ["cart", cartId],
		queryFn: () => api.getCart(cartId),
		enabled: Boolean(cartId),
		staleTime: 1e4
	});
	const ensureCart = async () => {
		let id = cartId ?? getCartId();
		if (!id) {
			id = (await api.createCart()).id;
			setCartId(id);
			setCartIdState(id);
		}
		return id;
	};
	const addItem = useMutation({
		mutationFn: async (variantId) => {
			const id = await ensureCart();
			return api.addCartItem(id, variantId);
		},
		onSuccess: (cart) => {
			setCartId(cart.id);
			setCartIdState(cart.id);
			queryClient.setQueryData(["cart", cart.id], cart);
		}
	});
	const syncCart = (cart) => {
		setCartId(cart.id);
		setCartIdState(cart.id);
		queryClient.setQueryData(["cart", cart.id], cart);
	};
	const updateItem = useMutation({
		mutationFn: async ({ itemId, quantity }) => {
			const id = await ensureCart();
			return api.updateCartItem(id, itemId, quantity);
		},
		onSuccess: syncCart
	});
	const removeItem = useMutation({
		mutationFn: async (itemId) => {
			const id = await ensureCart();
			return api.removeCartItem(id, itemId);
		},
		onSuccess: syncCart
	});
	const applyCoupon = useMutation({
		mutationFn: async (code) => {
			const id = await ensureCart();
			return api.applyCartCoupon(id, code);
		},
		onSuccess: syncCart
	});
	const removeCoupon = useMutation({
		mutationFn: async () => {
			const id = await ensureCart();
			return api.removeCartCoupon(id);
		},
		onSuccess: syncCart
	});
	const clearLocalCart = () => {
		clearCartId();
		setCartIdState(null);
		queryClient.removeQueries({ queryKey: ["cart"] });
	};
	const cart = cartQuery.data ?? addItem.data ?? updateItem.data ?? removeItem.data ?? applyCoupon.data ?? removeCoupon.data;
	return {
		cart,
		cartId: cartId ?? getCartId(),
		itemCount: cart?.itemCount ?? 0,
		isLoading: cartQuery.isLoading,
		addItem,
		updateItem,
		removeItem,
		applyCoupon,
		removeCoupon,
		clearLocalCart,
		refetch: cartQuery.refetch
	};
}
function useWishlist() {
	const queryClient = useQueryClient();
	const [wishlistId, setWishlistIdState] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setWishlistIdState(getWishlistId());
	}, []);
	const wishlistQuery = useQuery({
		queryKey: ["wishlist", wishlistId],
		queryFn: () => api.getWishlist(wishlistId),
		enabled: Boolean(wishlistId),
		staleTime: 1e4
	});
	const syncWishlist = (wishlist) => {
		setWishlistId(wishlist.id);
		setWishlistIdState(wishlist.id);
		queryClient.setQueryData(["wishlist", wishlist.id], wishlist);
	};
	const ensureWishlist = async () => {
		let id = wishlistId ?? getWishlistId();
		if (!id) {
			id = (await api.createWishlist()).id;
			setWishlistId(id);
			setWishlistIdState(id);
		}
		return id;
	};
	const addItem = useMutation({
		mutationFn: async (variantId) => {
			const id = await ensureWishlist();
			return api.addWishlistItem(id, variantId);
		},
		onSuccess: syncWishlist
	});
	const removeItem = useMutation({
		mutationFn: async (itemId) => {
			const id = await ensureWishlist();
			return api.removeWishlistItem(id, itemId);
		},
		onSuccess: syncWishlist
	});
	const removeVariant = useMutation({
		mutationFn: async (variantId) => {
			const id = await ensureWishlist();
			return api.removeWishlistVariant(id, variantId);
		},
		onSuccess: syncWishlist
	});
	const toggleItem = useMutation({
		mutationFn: async (variantId) => {
			const id = await ensureWishlist();
			const existing = (queryClient.getQueryData(["wishlist", id]) ?? await api.getWishlist(id).catch(() => null))?.items.find((item) => item.variantId === variantId);
			if (existing) return api.removeWishlistItem(id, existing.id);
			return api.addWishlistItem(id, variantId);
		},
		onSuccess: syncWishlist
	});
	const wishlist = wishlistQuery.data ?? addItem.data ?? removeItem.data ?? removeVariant.data ?? toggleItem.data;
	const productIds = new Set(wishlist?.items.map((item) => item.product.id) ?? []);
	const variantIds = new Set(wishlist?.items.map((item) => item.variantId) ?? []);
	return {
		wishlist,
		items: wishlist?.items ?? [],
		itemCount: wishlist?.itemCount ?? 0,
		isLoading: wishlistQuery.isLoading,
		isSaved: (productOrVariantId) => productIds.has(productOrVariantId) || variantIds.has(productOrVariantId),
		addItem,
		removeItem,
		removeVariant,
		toggleItem
	};
}
function pickDisplayProducts(catalog, filter) {
	if (!catalog) return [];
	if (filter === "All") return catalog.products;
	const gender = filter.toLowerCase();
	return catalog.products.filter((p) => {
		if (!p.gender) return false;
		if (gender === "kids") return p.gender === "kids";
		return p.gender === gender || p.gender === "unisex";
	});
}
function useCmsHome() {
	return useQuery({
		queryKey: ["cms", "home"],
		queryFn: () => api.getCmsHome(),
		staleTime: 6e4
	});
}
function useCmsBanners() {
	return useQuery({
		queryKey: ["cms", "banners"],
		queryFn: () => api.getCmsBanners(),
		staleTime: 6e4
	});
}
function useCmsNav() {
	return useQuery({
		queryKey: ["cms", "nav"],
		queryFn: () => api.getCmsNav(),
		staleTime: 6e4
	});
}
function useCmsSettings() {
	return useQuery({
		queryKey: ["cms", "settings"],
		queryFn: () => api.getCmsSettings(),
		staleTime: 6e4
	});
}
function sectionPayload(sections, key) {
	return sections?.find((s) => s.key === key)?.payload ?? {};
}
function str(payload, key, fallback = "") {
	const v = payload[key];
	return typeof v === "string" && v.trim() ? v : fallback;
}
var NAV_LINKS = [
	{
		labelKey: "new",
		to: "/shop",
		search: {
			sort: "newest",
			days: "30"
		}
	},
	{
		labelKey: "men",
		to: "/shop",
		search: { gender: "men" }
	},
	{
		labelKey: "women",
		to: "/shop",
		search: { gender: "women" }
	},
	{
		labelKey: "kids",
		to: "/shop",
		search: { gender: "kids" }
	},
	{
		labelKey: "sale",
		to: "/shop",
		search: { onSale: "true" }
	},
	{
		labelKey: "brands",
		to: "/brands"
	}
];
function SiteHeader({ search = "", onSearchChange, showSearch = true }) {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [accountOpen, setAccountOpen] = (0, import_react.useState)(false);
	const [localSearch, setLocalSearch] = (0, import_react.useState)(search);
	const navigate = useNavigate();
	const { itemCount } = useCart();
	const { itemCount: wishlistCount } = useWishlist();
	const { isCartBouncing, plusOneBadges } = useFlyCart();
	const { user, isAuthenticated, logout } = useAuth();
	const { t } = useLocale();
	const { data: cmsNav } = useCmsNav();
	const { data: cmsSettings } = useCmsSettings();
	const headerLinks = cmsNav?.header?.length ? cmsNav.header : NAV_LINKS.map((n) => ({
		label: t(n.labelKey),
		url: n.search ? `${n.to}?${new URLSearchParams(n.search).toString()}` : n.to
	}));
	const storeName = typeof cmsSettings?.storeName === "string" && cmsSettings.storeName || "SOLE";
	const logoUrl = typeof cmsSettings?.logoUrl === "string" ? cmsSettings.logoUrl : "";
	(0, import_react.useEffect)(() => {
		setLocalSearch(search);
	}, [search]);
	const value = onSearchChange ? search : localSearch;
	const setValue = (next) => {
		if (onSearchChange) onSearchChange(next);
		else setLocalSearch(next);
	};
	const goToSearch = (raw) => {
		const q = raw.trim();
		if (q.length < 1) return;
		setMenuOpen(false);
		navigate({
			to: "/shop",
			search: { search: q }
		});
	};
	const onKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			goToSearch(value);
		}
	};
	const handleLogout = () => {
		logout();
		setAccountOpen(false);
		toast.success("Signed out");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl items-center justify-between px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "lg:hidden",
						onClick: () => setMenuOpen(!menuOpen),
						"aria-label": "Menu",
						children: menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-display text-2xl font-black tracking-tighter flex items-center gap-2",
						children: logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logoUrl,
							alt: storeName,
							className: "h-8 max-w-[140px] object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [storeName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-accent",
							children: "."
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden lg:flex gap-7 text-sm font-medium",
						children: headerLinks.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: n.url,
							className: "relative py-1 transition hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all hover:after:w-full",
							children: n.label
						}, `${n.label}-${n.url}`))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					showSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden md:flex items-center gap-2 rounded-full bg-muted px-4 py-2 w-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: t("searchPlaceholder"),
							value,
							onChange: (e) => setValue(e.target.value),
							onKeyDown,
							className: "bg-transparent text-sm outline-none flex-1",
							"aria-label": "Search products"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden sm:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSwitcher, { variant: "header" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						asChild: true,
						className: "relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/wishlist",
							"aria-label": t("wishlist"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5" }), wishlistCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground grid place-items-center",
								children: wishlistCount
							})]
						})
					}),
					isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Account",
							onClick: () => setAccountOpen((o) => !o),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-accent" })
						}), accountOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-lg p-3 z-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground truncate mb-2",
									children: user?.email
								}),
								isStaffRole(user?.role) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin",
									onClick: () => setAccountOpen(false),
									className: "flex w-full items-center gap-2 text-sm font-medium py-2 hover:text-accent",
									children: t("adminCrm")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleLogout,
									className: "flex w-full items-center gap-2 text-sm font-medium py-2 hover:text-accent",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }),
										" ",
										t("logOut")
									]
								})
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							"aria-label": t("signIn"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						asChild: true,
						className: `relative transition-transform ${isCartBouncing ? "animate-cart-bounce text-accent" : ""}`,
						"data-cart-target": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							"aria-label": t("cart"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: `h-5 w-5 ${isCartBouncing ? "text-accent" : ""}` }),
								itemCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground grid place-items-center",
									children: itemCount
								}),
								plusOneBadges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-plus-one absolute left-1/2 top-0 pointer-events-none rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-extrabold text-accent-foreground shadow-lg border border-white/20",
									children: "+1"
								}, badge.id))
							]
						})
					})
				]
			})]
		}), menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:hidden border-t border-border px-4 py-3 flex flex-col gap-3",
			children: [
				showSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-full bg-muted px-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						placeholder: t("searchPlaceholder"),
						value,
						onChange: (e) => setValue(e.target.value),
						onKeyDown,
						className: "bg-transparent text-sm outline-none flex-1",
						"aria-label": "Search products"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSwitcher, { variant: "header" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex flex-col gap-3",
					children: [
						headerLinks.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: n.url,
							onClick: () => setMenuOpen(false),
							className: "text-sm font-medium py-1",
							children: n.label
						}, `${n.label}-${n.url}`)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/wishlist",
							onClick: () => setMenuOpen(false),
							className: "text-sm font-medium py-1",
							children: [t("wishlist"), wishlistCount > 0 ? ` (${wishlistCount})` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							onClick: () => setMenuOpen(false),
							className: "text-sm font-medium py-1",
							children: [t("cart"), itemCount > 0 ? ` (${itemCount})` : ""]
						}),
						isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "text-sm font-medium py-1 text-left",
							onClick: () => {
								handleLogout();
								setMenuOpen(false);
							},
							children: [
								t("logOut"),
								" (",
								user?.email,
								")"
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							onClick: () => setMenuOpen(false),
							className: "text-sm font-medium py-1",
							children: t("signIn")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							onClick: () => setMenuOpen(false),
							className: "text-sm font-medium py-1",
							children: "Create account"
						})] })
					]
				})
			]
		})]
	});
}
//#endregion
export { str as a, useCart as c, useCmsHome as d, useCmsNav as f, useWishlist as g, useShopProducts as h, sectionPayload as i, useCategories as l, useHomeCatalog as m, SiteHeader as n, useAuth as o, useCmsSettings as p, pickDisplayProducts as r, useBrands as s, LocaleSwitcher as t, useCmsBanners as u };
