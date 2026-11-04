import { n as __exportAll$1 } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CkEPFrmT.js
var api_CkEPFrmT_exports = /* @__PURE__ */ __exportAll$1({
	n: () => api,
	r: () => api_exports,
	t: () => ApiError
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var api_exports = /* @__PURE__ */ __exportAll({
	ApiError: () => ApiError,
	api: () => api,
	getApiBase: () => getApiBase
});
var CLIENT_API_BASE = "http://127.0.0.1:3001";
var SERVER_API_BASE = "http://127.0.0.1:3001";
function getApiBase() {
	if (typeof window === "undefined") return SERVER_API_BASE;
	return CLIENT_API_BASE;
}
var ApiError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
		this.name = "ApiError";
	}
};
async function request(path, init) {
	const token = typeof window !== "undefined" ? localStorage.getItem("sole_token") ?? null : null;
	const response = await fetch(`${getApiBase()}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {},
			...init?.headers
		}
	});
	if (!response.ok) {
		if (response.status === 401 && typeof window !== "undefined") {
			if (token && !path.startsWith("/auth/login") && !path.startsWith("/auth/register")) try {
				localStorage.removeItem("sole_token");
				localStorage.removeItem("sole_user");
				window.dispatchEvent(new Event("sole_token_changed"));
			} catch {}
		}
		throw new ApiError(await response.text() || response.statusText, response.status);
	}
	if (response.status === 204) return;
	return response.json();
}
var api = {
	getHomeCatalog: () => request("/catalog/home"),
	getProducts: (params) => {
		const query = new URLSearchParams();
		if (params) Object.entries(params).forEach(([key, value]) => {
			if (value !== void 0 && value !== "") query.set(key, String(value));
		});
		const qs = query.toString();
		return request(`/products${qs ? `?${qs}` : ""}`);
	},
	getProduct: (id) => request(`/products/${id}`),
	getBrands: () => request("/brands"),
	getCategories: () => request("/categories"),
	createCart: () => request("/cart", { method: "POST" }),
	getCart: (cartId) => request(`/cart/${cartId}`),
	addCartItem: (cartId, variantId, quantity = 1) => request(`/cart/${cartId}/items`, {
		method: "POST",
		body: JSON.stringify({
			variantId,
			quantity
		})
	}),
	updateCartItem: (cartId, itemId, quantity) => request(`/cart/${cartId}/items/${itemId}`, {
		method: "PATCH",
		body: JSON.stringify({ quantity })
	}),
	removeCartItem: (cartId, itemId) => request(`/cart/${cartId}/items/${itemId}`, { method: "DELETE" }),
	applyCartCoupon: (cartId, code) => request(`/cart/${cartId}/coupon`, {
		method: "POST",
		body: JSON.stringify({ code })
	}),
	removeCartCoupon: (cartId) => request(`/cart/${cartId}/coupon`, { method: "DELETE" }),
	getShippingRates: (payload) => request("/shipping/rates", {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	checkoutPreview: (payload) => request("/checkout/preview", {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	placeOrder: (payload) => request("/checkout/place", {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	payOrder: (orderId, payload) => request(`/payments/orders/${orderId}/pay`, {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	getOrderConfirmation: (orderId) => request(`/orders/${orderId}/confirmation`),
	getAddresses: () => request("/addresses"),
	validateCoupon: (code, cartId) => request(`/coupons/validate?code=${encodeURIComponent(code)}&cartId=${encodeURIComponent(cartId)}`),
	createWishlist: () => request("/wishlist", { method: "POST" }),
	getWishlist: (wishlistId) => request(`/wishlist/${wishlistId}`),
	addWishlistItem: (wishlistId, variantId) => request(`/wishlist/${wishlistId}/items`, {
		method: "POST",
		body: JSON.stringify({ variantId })
	}),
	removeWishlistItem: (wishlistId, itemId) => request(`/wishlist/${wishlistId}/items/${itemId}`, { method: "DELETE" }),
	removeWishlistVariant: (wishlistId, variantId) => request(`/wishlist/${wishlistId}/variants/${variantId}`, { method: "DELETE" }),
	login: (email, password) => request("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email,
			password
		})
	}),
	register: (payload) => request("/auth/register", {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	me: () => request("/auth/me"),
	subscribeNewsletter: (email, preference) => request("/newsletter/subscribe", {
		method: "POST",
		body: JSON.stringify({
			email,
			preference
		})
	}),
	updateNewsletterPreference: (email, preference) => request("/newsletter/preference", {
		method: "POST",
		body: JSON.stringify({
			email,
			preference
		})
	}),
	unsubscribeNewsletter: (email) => request("/newsletter/unsubscribe", {
		method: "POST",
		body: JSON.stringify({ email })
	}),
	getNewsletterStatus: (email) => request(`/newsletter/status?email=${encodeURIComponent(email)}`),
	getCmsPages: (type) => {
		return request(`/cms/pages${type ? `?type=${encodeURIComponent(type)}` : ""}`);
	},
	getCmsPage: (slug) => request(`/cms/pages/${encodeURIComponent(slug)}`),
	getCmsHome: () => request("/cms/home"),
	getCmsBanners: () => request("/cms/banners"),
	getCmsNav: () => request("/cms/nav"),
	getCmsSettings: () => request("/cms/settings"),
	getCmsBlog: () => request("/cms/blog"),
	getCmsBlogPost: (slug) => request(`/cms/blog/${encodeURIComponent(slug)}`),
	submitContact: (payload) => request("/support/contact", {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	getReviews: (params) => {
		const query = new URLSearchParams();
		if (params?.productId) query.set("productId", params.productId);
		if (params?.limit != null) query.set("limit", String(params.limit));
		const qs = query.toString();
		return request(`/reviews${qs ? `?${qs}` : ""}`);
	},
	createReview: (productId, payload) => request(`/products/${productId}/reviews`, {
		method: "POST",
		body: JSON.stringify(payload)
	}),
	admin: {
		stats: () => request("/admin/stats"),
		analytics: (params) => request(`/admin/analytics${buildAdminQuery(params)}`),
		products: (params) => request(`/admin/products${buildAdminQuery(params)}`),
		product: (id) => request(`/admin/products/${id}`),
		createProduct: (payload) => request("/admin/products", {
			method: "POST",
			body: JSON.stringify(payload)
		}),
		updateProduct: (id, payload) => request(`/admin/products/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		duplicateProduct: (id) => request(`/admin/products/${id}/duplicate`, { method: "POST" }),
		archiveProduct: (id) => request(`/admin/products/${id}/archive`, { method: "POST" }),
		restoreProduct: (id) => request(`/admin/products/${id}/restore`, { method: "POST" }),
		deleteProduct: (id) => request(`/admin/products/${id}`, { method: "DELETE" }),
		brands: () => request("/admin/brands"),
		createBrand: (payload) => request("/admin/brands", {
			method: "POST",
			body: JSON.stringify(payload)
		}),
		updateBrand: (id, payload) => request(`/admin/brands/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		updateVariant: (id, payload) => request(`/admin/variants/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		categories: () => request("/admin/categories"),
		createCategory: (payload) => request("/admin/categories", {
			method: "POST",
			body: JSON.stringify(payload)
		}),
		updateCategory: (id, payload) => request(`/admin/categories/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		deleteCategory: (id) => request(`/admin/categories/${id}`, { method: "DELETE" }),
		reorderCategories: (items) => request("/admin/categories/reorder", {
			method: "POST",
			body: JSON.stringify({ items })
		}),
		inventory: (params) => request(`/admin/inventory${buildAdminQuery(params)}`),
		adjustStock: (variantId, payload) => request(`/admin/inventory/${variantId}/adjust`, {
			method: "POST",
			body: JSON.stringify(payload)
		}),
		orders: (params) => request(`/admin/orders${buildAdminQuery(params)}`),
		order: (id) => request(`/admin/orders/${id}`),
		updateOrder: (id, payload) => request(`/admin/orders/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		/** @deprecated use updateOrder */
		updateOrderStatus: (id, status) => request(`/admin/orders/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ status })
		}),
		crmStats: () => request("/admin/crm/stats"),
		customers: (params) => request(`/admin/customers${buildAdminQuery(params)}`),
		customer: (id) => request(`/admin/customers/${id}`),
		updateCustomer: (id, payload) => request(`/admin/customers/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		addCustomerNote: (id, body) => request(`/admin/customers/${id}/notes`, {
			method: "POST",
			body: JSON.stringify({ body })
		}),
		reviews: (params) => request(`/admin/reviews${buildAdminQuery(params)}`),
		updateReview: (id, payload) => request(`/admin/reviews/${id}`, {
			method: "PATCH",
			body: JSON.stringify(typeof payload === "boolean" ? { approved: payload } : payload)
		}),
		deleteReview: (id) => request(`/admin/reviews/${id}`, { method: "DELETE" }),
		coupons: () => request("/admin/coupons"),
		createCoupon: (payload) => request("/admin/coupons", {
			method: "POST",
			body: JSON.stringify(payload)
		}),
		updateCoupon: (id, payload) => request(`/admin/coupons/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		deleteCoupon: (id) => request(`/admin/coupons/${id}`, { method: "DELETE" }),
		returns: (params) => request(`/admin/returns${buildAdminQuery(params)}`),
		getReturn: (id) => request(`/admin/returns/${id}`),
		createReturn: (payload) => request("/admin/returns", {
			method: "POST",
			body: JSON.stringify(payload)
		}),
		updateReturn: (id, payload) => request(`/admin/returns/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		refunds: (limit = 100) => request(`/admin/refunds?limit=${limit}`),
		payments: (params) => request(`/admin/payments${buildAdminQuery(params)}`),
		shippingSettings: () => request("/admin/shipping/settings"),
		updateShippingSettings: (payload) => request("/admin/shipping/settings", {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		settings: () => request("/admin/settings"),
		updateSettings: (payload) => request("/admin/settings", {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		users: () => request("/admin/users"),
		createUser: (payload) => request("/admin/users", {
			method: "POST",
			body: JSON.stringify(payload)
		}),
		updateUser: (id, payload) => request(`/admin/users/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		}),
		roles: () => request("/admin/roles"),
		auditLogs: (params) => request(`/admin/audit-logs${buildAdminQuery(params)}`),
		notifications: (limit = 50) => request(`/admin/notifications?limit=${limit}`),
		markNotificationRead: (id) => request(`/admin/notifications/${id}/read`, { method: "POST" }),
		markAllNotificationsRead: () => request("/admin/notifications/read-all", { method: "POST" }),
		support: (limit = 100) => request(`/admin/support?limit=${limit}`),
		supportMessage: (id) => request(`/admin/support/${id}`),
		newsletter: (limit = 200) => request(`/admin/newsletter?limit=${limit}`),
		deleteNewsletter: (id) => request(`/admin/newsletter/${id}`, { method: "DELETE" }),
		cms: {
			dashboard: () => request("/admin/cms/dashboard"),
			pages: (params) => request(`/admin/cms/pages${buildAdminQuery(params)}`),
			page: (id) => request(`/admin/cms/pages/${id}`),
			createPage: (payload) => request("/admin/cms/pages", {
				method: "POST",
				body: JSON.stringify(payload)
			}),
			updatePage: (id, payload) => request(`/admin/cms/pages/${id}`, {
				method: "PATCH",
				body: JSON.stringify(payload)
			}),
			publishPage: (id) => request(`/admin/cms/pages/${id}/publish`, { method: "POST" }),
			unpublishPage: (id) => request(`/admin/cms/pages/${id}/unpublish`, { method: "POST" }),
			deletePage: (id) => request(`/admin/cms/pages/${id}`, { method: "DELETE" }),
			homepage: () => request("/admin/cms/homepage"),
			updateHomepageSection: (id, payload) => request(`/admin/cms/homepage/${id}`, {
				method: "PATCH",
				body: JSON.stringify(payload)
			}),
			reorderHomepage: (items) => request("/admin/cms/homepage/reorder", {
				method: "POST",
				body: JSON.stringify({ items })
			}),
			banners: () => request("/admin/cms/banners"),
			createBanner: (payload) => request("/admin/cms/banners", {
				method: "POST",
				body: JSON.stringify(payload)
			}),
			updateBanner: (id, payload) => request(`/admin/cms/banners/${id}`, {
				method: "PATCH",
				body: JSON.stringify(payload)
			}),
			publishBanner: (id) => request(`/admin/cms/banners/${id}/publish`, { method: "POST" }),
			unpublishBanner: (id) => request(`/admin/cms/banners/${id}/unpublish`, { method: "POST" }),
			deleteBanner: (id) => request(`/admin/cms/banners/${id}`, { method: "DELETE" }),
			blog: (params) => request(`/admin/cms/blog${buildAdminQuery(params)}`),
			blogPost: (id) => request(`/admin/cms/blog/${id}`),
			createBlog: (payload) => request("/admin/cms/blog", {
				method: "POST",
				body: JSON.stringify(payload)
			}),
			updateBlog: (id, payload) => request(`/admin/cms/blog/${id}`, {
				method: "PATCH",
				body: JSON.stringify(payload)
			}),
			publishBlog: (id) => request(`/admin/cms/blog/${id}/publish`, { method: "POST" }),
			unpublishBlog: (id) => request(`/admin/cms/blog/${id}/unpublish`, { method: "POST" }),
			deleteBlog: (id) => request(`/admin/cms/blog/${id}`, { method: "DELETE" }),
			media: (search) => request(`/admin/cms/media${buildAdminQuery({ search })}`),
			uploadMedia: async (file) => {
				const token = typeof window !== "undefined" ? localStorage.getItem("sole_token") : null;
				const form = new FormData();
				form.append("file", file);
				const response = await fetch(`${getApiBase()}/admin/cms/media`, {
					method: "POST",
					headers: token ? { Authorization: `Bearer ${token}` } : void 0,
					body: form
				});
				if (!response.ok) throw new ApiError(await response.text() || response.statusText, response.status);
				return response.json();
			},
			updateMedia: (id, altText) => request(`/admin/cms/media/${id}`, {
				method: "PATCH",
				body: JSON.stringify({ altText })
			}),
			deleteMedia: (id) => request(`/admin/cms/media/${id}`, { method: "DELETE" }),
			navigation: () => request("/admin/cms/navigation"),
			saveNavigation: (location, items) => request(`/admin/cms/navigation/${location}`, {
				method: "PATCH",
				body: JSON.stringify({ items })
			}),
			settings: () => request("/admin/cms/settings"),
			updateSettings: (payload) => request("/admin/cms/settings", {
				method: "PATCH",
				body: JSON.stringify(payload)
			})
		}
	}
};
function buildAdminQuery(params) {
	const q = new URLSearchParams();
	if (params) Object.entries(params).forEach(([key, value]) => {
		if (value !== void 0 && value !== null && value !== "") q.set(key, String(value));
	});
	const qs = q.toString();
	return qs ? `?${qs}` : "";
}
//#endregion
export { api as n, api_CkEPFrmT_exports as r, ApiError as t };
