const CLIENT_API_BASE = import.meta.env.VITE_API_URL ?? "/api";
const SERVER_API_BASE =
  import.meta.env.VITE_SERVER_API_URL ??
  (import.meta.env.DEV ? "http://127.0.0.1:3001" : (import.meta.env.VITE_API_URL ?? "/api"));

export function getApiBase() {
  if (typeof window === "undefined") {
    return SERVER_API_BASE;
  }
  if (CLIENT_API_BASE && CLIENT_API_BASE !== "/api") {
    return CLIENT_API_BASE;
  }
  if (import.meta.env.DEV) {
    const host = window.location.hostname || "127.0.0.1";
    return `http://${host}:3001`;
  }
  return CLIENT_API_BASE;
}

export function resolveMediaUrl(path?: string | null): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  const base = getApiBase();
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (cleanPath.startsWith("/uploads/")) {
    const hostBase = base.replace(/\/api\/?$/, "");
    return `${hostBase}${cleanPath}`;
  }
  return `${base}${cleanPath}`;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? (localStorage.getItem("sole_token") ?? null) : null;

  const response = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      // If a token was supplied but rejected with 401 Unauthorized (expired or invalid JWT),
      // purge stored credentials to avoid rapid-fire duplicate 401 storms
      if (token && !path.startsWith("/auth/login") && !path.startsWith("/auth/register")) {
        try {
          localStorage.removeItem("sole_token");
          localStorage.removeItem("sole_user");
          window.dispatchEvent(new Event("sole_token_changed"));
        } catch {
          // ignore storage access errors
        }
      }
    }
    const body = await response.text();
    throw new ApiError(body || response.statusText, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getHomeCatalog: () => request<import("./types").HomeCatalog>("/catalog/home"),
  getProducts: (params?: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") query.set(key, String(value));
      });
    }
    const qs = query.toString();
    return request<import("./types").ProductCard[]>(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id: string) => request<import("./types").ProductDetail>(`/products/${id}`),
  getBrands: () => request<import("./types").Brand[]>("/brands"),
  getCategories: () => request<import("./types").CategoryCard[]>("/categories"),
  createCart: () => request<{ id: string }>("/cart", { method: "POST" }),
  getCart: (cartId: string) => request<import("./types").Cart>(`/cart/${cartId}`),
  addCartItem: (cartId: string, variantId: string, quantity = 1) =>
    request<import("./types").Cart>(`/cart/${cartId}/items`, {
      method: "POST",
      body: JSON.stringify({ variantId, quantity }),
    }),
  updateCartItem: (cartId: string, itemId: string, quantity: number) =>
    request<import("./types").Cart>(`/cart/${cartId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (cartId: string, itemId: string) =>
    request<import("./types").Cart>(`/cart/${cartId}/items/${itemId}`, {
      method: "DELETE",
    }),
  applyCartCoupon: (cartId: string, code: string) =>
    request<import("./types").Cart>(`/cart/${cartId}/coupon`, {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  removeCartCoupon: (cartId: string) =>
    request<import("./types").Cart>(`/cart/${cartId}/coupon`, { method: "DELETE" }),
  getShippingRates: (payload: { cartId: string; country: string; zipCode?: string }) =>
    request<{ freeShippingThreshold: number; methods: import("./types").ShippingMethod[] }>(
      "/shipping/rates",
      { method: "POST", body: JSON.stringify(payload) },
    ),
  checkoutPreview: (payload: {
    cartId: string;
    shippingMethod: "standard" | "express";
    couponCode?: string;
  }) =>
    request<import("./types").CheckoutPreview>("/checkout/preview", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  placeOrder: (payload: {
    cartId: string;
    email: string;
    shippingMethod: "standard" | "express";
    address: import("./types").CheckoutAddress;
    couponCode?: string;
    paymentMethod: "mock";
  }) =>
    request<import("./types").PlaceOrderResult>("/checkout/place", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  payOrder: (orderId: string, payload: { provider: "mock"; cardLast4?: string }) =>
    request<{
      orderId: string;
      status: string;
      payment: { provider: string; status: string; amount: number };
    }>(`/payments/orders/${orderId}/pay`, { method: "POST", body: JSON.stringify(payload) }),
  getOrderConfirmation: (orderId: string) =>
    request<import("./types").OrderConfirmation>(`/orders/${orderId}/confirmation`),
  getAddresses: () => request<import("./types").Address[]>("/addresses"),
  validateCoupon: (code: string, cartId: string) =>
    request<{
      valid: boolean;
      code: string | null;
      discount: number;
      freeShipping: boolean;
      subtotal: number;
    }>(`/coupons/validate?code=${encodeURIComponent(code)}&cartId=${encodeURIComponent(cartId)}`),
  createWishlist: () => request<{ id: string }>("/wishlist", { method: "POST" }),
  getWishlist: (wishlistId: string) =>
    request<import("./types").Wishlist>(`/wishlist/${wishlistId}`),
  addWishlistItem: (wishlistId: string, variantId: string) =>
    request<import("./types").Wishlist>(`/wishlist/${wishlistId}/items`, {
      method: "POST",
      body: JSON.stringify({ variantId }),
    }),
  removeWishlistItem: (wishlistId: string, itemId: string) =>
    request<import("./types").Wishlist>(`/wishlist/${wishlistId}/items/${itemId}`, {
      method: "DELETE",
    }),
  removeWishlistVariant: (wishlistId: string, variantId: string) =>
    request<import("./types").Wishlist>(`/wishlist/${wishlistId}/variants/${variantId}`, {
      method: "DELETE",
    }),
  login: (email: string, password: string) =>
    request<import("./types").AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: { email: string; password: string; firstName?: string; lastName?: string }) =>
    request<import("./types").AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () =>
    request<{
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      role: { name: string } | string;
    }>("/auth/me"),
  subscribeNewsletter: (email: string, preference?: string) =>
    request<{ ok: boolean; email?: string }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, preference }),
    }),
  updateNewsletterPreference: (email: string, preference: string) =>
    request<{ ok: boolean }>("/newsletter/preference", {
      method: "POST",
      body: JSON.stringify({ email, preference }),
    }),
  unsubscribeNewsletter: (email: string) =>
    request<{ ok: boolean }>("/newsletter/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  getNewsletterStatus: (email: string) =>
    request<{ isSubscribed: boolean; preference: string; email?: string }>(
      `/newsletter/status?email=${encodeURIComponent(email)}`,
    ),
  getCmsPages: (type?: string) => {
    const qs = type ? `?type=${encodeURIComponent(type)}` : "";
    return request<
      Array<{ id: string; slug: string; title: string; type: string; published: boolean }>
    >(`/cms/pages${qs}`);
  },
  getCmsPage: (slug: string) =>
    request<{
      id: string;
      slug: string;
      title: string;
      content: string;
      type: string;
      published: boolean;
      featuredImageUrl?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
      seoKeywords?: string | null;
      canonicalUrl?: string | null;
      ogTitle?: string | null;
      ogDescription?: string | null;
      ogImage?: string | null;
      publishedAt?: string | null;
      updatedAt?: string;
    }>(`/cms/pages/${encodeURIComponent(slug)}`),
  getCmsHome: () => request<{ sections: import("./types").CmsHomeSection[] }>("/cms/home"),
  getCmsBanners: () => request<import("./types").CmsBanner[]>("/cms/banners"),
  getCmsNav: () => request<Record<string, Array<{ label: string; url: string }>>>("/cms/nav"),
  getCmsSettings: () => request<import("./types").CmsPublicSettings>("/cms/settings"),
  getCmsBlog: () => request<import("./types").CmsBlogPost[]>("/cms/blog"),
  getCmsBlogPost: (slug: string) =>
    request<import("./types").CmsBlogPost>(`/cms/blog/${encodeURIComponent(slug)}`),
  submitContact: (payload: { name: string; email: string; message: string }) =>
    request<{ ok: boolean }>("/support/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getReviews: (params?: { productId?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.productId) query.set("productId", params.productId);
    if (params?.limit != null) query.set("limit", String(params.limit));
    const qs = query.toString();
    return request<import("./types").ProductReview[]>(`/reviews${qs ? `?${qs}` : ""}`);
  },
  createReview: (
    productId: string,
    payload: { rating: number; title?: string; comment?: string },
  ) =>
    request<import("./types").ProductReview>(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  admin: {
    stats: () => request<import("./types").AdminStats>("/admin/stats"),
    analytics: (params?: { range?: string; from?: string; to?: string }) =>
      request<import("./types").AdminAnalytics>(`/admin/analytics${buildAdminQuery(params)}`),

    products: (params?: {
      search?: string;
      status?: string;
      category?: string;
      brandId?: string;
      sort?: string;
      page?: number;
      limit?: number;
    }) =>
      request<import("./types").Paginated<import("./types").AdminProductListItem>>(
        `/admin/products${buildAdminQuery(params)}`,
      ),
    product: (id: string) => request<Record<string, unknown>>(`/admin/products/${id}`),
    createProduct: (payload: Record<string, unknown>) =>
      request<Record<string, unknown>>("/admin/products", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateProduct: (id: string, payload: Record<string, unknown>) =>
      request<Record<string, unknown>>(`/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    duplicateProduct: (id: string) =>
      request<Record<string, unknown>>(`/admin/products/${id}/duplicate`, { method: "POST" }),
    archiveProduct: (id: string) =>
      request<Record<string, unknown>>(`/admin/products/${id}/archive`, { method: "POST" }),
    restoreProduct: (id: string) =>
      request<Record<string, unknown>>(`/admin/products/${id}/restore`, { method: "POST" }),
    deleteProduct: (id: string) =>
      request<{ ok?: boolean }>(`/admin/products/${id}`, { method: "DELETE" }),

    brands: () => request<import("./types").AdminBrand[]>("/admin/brands"),
    createBrand: (payload: { name: string; description?: string; logoUrl?: string }) =>
      request<import("./types").AdminBrand>("/admin/brands", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateBrand: (id: string, payload: Record<string, unknown>) =>
      request<import("./types").AdminBrand>(`/admin/brands/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    updateVariant: (
      id: string,
      payload: {
        stock?: number;
        size?: string | null;
        color?: string | null;
        material?: string | null;
        sku?: string | null;
        price?: number | null;
        priceOffset?: number;
        imageUrl?: string | null;
      },
    ) =>
      request<Record<string, unknown>>(`/admin/variants/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    categories: () => request<import("./types").AdminCategory[]>("/admin/categories"),
    createCategory: (payload: Record<string, unknown>) =>
      request<import("./types").AdminCategory>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateCategory: (id: string, payload: Record<string, unknown>) =>
      request<import("./types").AdminCategory>(`/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    deleteCategory: (id: string) =>
      request<{ ok?: boolean }>(`/admin/categories/${id}`, { method: "DELETE" }),
    reorderCategories: (items: Array<{ id: string; order: number }>) =>
      request<import("./types").AdminCategory[]>("/admin/categories/reorder", {
        method: "POST",
        body: JSON.stringify({ items }),
      }),

    inventory: (params?: { search?: string; lowStock?: string; page?: number; limit?: number }) =>
      request<import("./types").Paginated<import("./types").AdminInventoryItem>>(
        `/admin/inventory${buildAdminQuery(params)}`,
      ),
    adjustStock: (
      variantId: string,
      payload: {
        mode: "increase" | "decrease" | "set";
        quantity: number;
        reason: string;
        lowStockThreshold?: number;
      },
    ) =>
      request<Record<string, unknown>>(`/admin/inventory/${variantId}/adjust`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    orders: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
      request<import("./types").Paginated<import("./types").AdminOrderListItem>>(
        `/admin/orders${buildAdminQuery(params)}`,
      ),
    order: (id: string) => request<Record<string, unknown>>(`/admin/orders/${id}`),
    updateOrder: (
      id: string,
      payload: {
        status: string;
        note?: string;
        trackingNumber?: string;
        shippingStatus?: string;
      },
    ) =>
      request<{ id: string; status: string }>(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    /** @deprecated use updateOrder */
    updateOrderStatus: (id: string, status: string) =>
      request<{ id: string; status: string }>(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    crmStats: () => request<import("./types").CrmDashboardStats>("/admin/crm/stats"),

    customers: (params?: { search?: string; segment?: string; page?: number; limit?: number }) =>
      request<import("./types").Paginated<import("./types").AdminCustomer>>(
        `/admin/customers${buildAdminQuery(params)}`,
      ),
    customer: (id: string) => request<Record<string, unknown>>(`/admin/customers/${id}`),
    updateCustomer: (
      id: string,
      payload: {
        disabled?: boolean;
        phone?: string | null;
        firstName?: string | null;
        lastName?: string | null;
      },
    ) =>
      request<Record<string, unknown>>(`/admin/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    addCustomerNote: (id: string, body: string) =>
      request<Record<string, unknown>>(`/admin/customers/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ body }),
      }),

    reviews: (params?: { approved?: string; limit?: number }) =>
      request<import("./types").AdminReviewItem[]>(`/admin/reviews${buildAdminQuery(params)}`),
    updateReview: (id: string, payload: boolean | { approved?: boolean; hidden?: boolean }) =>
      request<{ id: string; approved?: boolean; hidden?: boolean }>(`/admin/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify(typeof payload === "boolean" ? { approved: payload } : payload),
      }),
    deleteReview: (id: string) =>
      request<{ ok?: boolean }>(`/admin/reviews/${id}`, { method: "DELETE" }),

    coupons: () => request<import("./types").AdminCoupon[]>("/admin/coupons"),
    createCoupon: (payload: Record<string, unknown>) =>
      request<import("./types").AdminCoupon>("/admin/coupons", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateCoupon: (id: string, payload: Record<string, unknown>) =>
      request<import("./types").AdminCoupon>(`/admin/coupons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    deleteCoupon: (id: string) =>
      request<{ ok?: boolean }>(`/admin/coupons/${id}`, { method: "DELETE" }),

    returns: (params?: { status?: string; limit?: number }) =>
      request<import("./types").AdminReturnItem[]>(`/admin/returns${buildAdminQuery(params)}`),
    getReturn: (id: string) => request<Record<string, unknown>>(`/admin/returns/${id}`),
    createReturn: (payload: { orderId: string; reason?: string }) =>
      request<import("./types").AdminReturnItem>("/admin/returns", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateReturn: (
      id: string,
      payload: {
        status?: string;
        resolution?: string;
        note?: string;
        refundAmount?: number;
      },
    ) =>
      request<Record<string, unknown>>(`/admin/returns/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    refunds: (limit = 100) =>
      request<import("./types").AdminRefundItem[]>(`/admin/refunds?limit=${limit}`),

    payments: (params?: { status?: string; page?: number; limit?: number }) =>
      request<import("./types").Paginated<import("./types").AdminPaymentItem>>(
        `/admin/payments${buildAdminQuery(params)}`,
      ),

    shippingSettings: () => request<import("./types").AdminSettings>("/admin/shipping/settings"),
    updateShippingSettings: (payload: Record<string, unknown>) =>
      request<import("./types").AdminSettings>("/admin/shipping/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    settings: () => request<import("./types").AdminSettings>("/admin/settings"),
    updateSettings: (payload: Record<string, unknown>) =>
      request<import("./types").AdminSettings>("/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    users: () => request<import("./types").AdminUser[]>("/admin/users"),
    createUser: (payload: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role: string;
    }) =>
      request<import("./types").AdminUser>("/admin/users", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateUser: (
      id: string,
      payload: {
        firstName?: string | null;
        lastName?: string | null;
        role?: string;
        disabled?: boolean;
        password?: string;
      },
    ) =>
      request<import("./types").AdminUser>(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    roles: () => request<import("./types").AdminRole[]>("/admin/roles"),
    auditLogs: (params?: { limit?: number; search?: string }) =>
      request<import("./types").AdminAuditLog[]>(`/admin/audit-logs${buildAdminQuery(params)}`),
    notifications: (limit = 50) =>
      request<import("./types").AdminNotification[]>(`/admin/notifications?limit=${limit}`),
    markNotificationRead: (id: string) =>
      request<import("./types").AdminNotification>(`/admin/notifications/${id}/read`, {
        method: "POST",
      }),
    markAllNotificationsRead: () =>
      request<{ ok?: boolean; count?: number }>("/admin/notifications/read-all", {
        method: "POST",
      }),

    support: (limit = 100) =>
      request<import("./types").AdminSupportMessage[]>(`/admin/support?limit=${limit}`),
    supportMessage: (id: string) =>
      request<import("./types").AdminSupportMessage>(`/admin/support/${id}`),
    newsletter: (limit = 200) =>
      request<import("./types").AdminNewsletterSubscriber[]>(`/admin/newsletter?limit=${limit}`),
    deleteNewsletter: (id: string) =>
      request<{ ok: boolean }>(`/admin/newsletter/${id}`, { method: "DELETE" }),

    cms: {
      dashboard: () => request<import("./types").CmsDashboard>("/admin/cms/dashboard"),
      pages: (params?: {
        search?: string;
        status?: string;
        type?: string;
        page?: number;
        limit?: number;
      }) =>
        request<import("./types").Paginated<import("./types").CmsPage>>(
          `/admin/cms/pages${buildAdminQuery(params)}`,
        ),
      page: (id: string) => request<import("./types").CmsPage>(`/admin/cms/pages/${id}`),
      createPage: (payload: Record<string, unknown>) =>
        request<import("./types").CmsPage>("/admin/cms/pages", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      updatePage: (id: string, payload: Record<string, unknown>) =>
        request<import("./types").CmsPage>(`/admin/cms/pages/${id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
      publishPage: (id: string) =>
        request<import("./types").CmsPage>(`/admin/cms/pages/${id}/publish`, { method: "POST" }),
      unpublishPage: (id: string) =>
        request<import("./types").CmsPage>(`/admin/cms/pages/${id}/unpublish`, { method: "POST" }),
      deletePage: (id: string) =>
        request<{ ok: boolean }>(`/admin/cms/pages/${id}`, { method: "DELETE" }),
      homepage: () => request<import("./types").CmsHomeSection[]>("/admin/cms/homepage"),
      updateHomepageSection: (id: string, payload: Record<string, unknown>) =>
        request<import("./types").CmsHomeSection>(`/admin/cms/homepage/${id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
      reorderHomepage: (items: Array<{ id: string; sortOrder: number }>) =>
        request<import("./types").CmsHomeSection[]>("/admin/cms/homepage/reorder", {
          method: "POST",
          body: JSON.stringify({ items }),
        }),
      banners: () => request<import("./types").CmsBanner[]>("/admin/cms/banners"),
      createBanner: (payload: Record<string, unknown>) =>
        request<import("./types").CmsBanner>("/admin/cms/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      updateBanner: (id: string, payload: Record<string, unknown>) =>
        request<import("./types").CmsBanner>(`/admin/cms/banners/${id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
      publishBanner: (id: string) =>
        request<import("./types").CmsBanner>(`/admin/cms/banners/${id}/publish`, {
          method: "POST",
        }),
      unpublishBanner: (id: string) =>
        request<import("./types").CmsBanner>(`/admin/cms/banners/${id}/unpublish`, {
          method: "POST",
        }),
      deleteBanner: (id: string) =>
        request<{ ok: boolean }>(`/admin/cms/banners/${id}`, { method: "DELETE" }),
      blog: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
        request<import("./types").Paginated<import("./types").CmsBlogPost>>(
          `/admin/cms/blog${buildAdminQuery(params)}`,
        ),
      blogPost: (id: string) => request<import("./types").CmsBlogPost>(`/admin/cms/blog/${id}`),
      createBlog: (payload: Record<string, unknown>) =>
        request<import("./types").CmsBlogPost>("/admin/cms/blog", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      updateBlog: (id: string, payload: Record<string, unknown>) =>
        request<import("./types").CmsBlogPost>(`/admin/cms/blog/${id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
      publishBlog: (id: string) =>
        request<import("./types").CmsBlogPost>(`/admin/cms/blog/${id}/publish`, { method: "POST" }),
      unpublishBlog: (id: string) =>
        request<import("./types").CmsBlogPost>(`/admin/cms/blog/${id}/unpublish`, {
          method: "POST",
        }),
      deleteBlog: (id: string) =>
        request<{ ok: boolean }>(`/admin/cms/blog/${id}`, { method: "DELETE" }),
      media: (search?: string) =>
        request<import("./types").CmsMedia[]>(`/admin/cms/media${buildAdminQuery({ search })}`),
      uploadMedia: async (file: File) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("sole_token") : null;
        const form = new FormData();
        form.append("file", file);
        const response = await fetch(`${getApiBase()}/admin/cms/media`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: form,
        });
        if (!response.ok) {
          const body = await response.text();
          throw new ApiError(body || response.statusText, response.status);
        }
        return response.json() as Promise<import("./types").CmsMedia>;
      },
      updateMedia: (id: string, altText?: string | null) =>
        request<import("./types").CmsMedia>(`/admin/cms/media/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ altText }),
        }),
      deleteMedia: (id: string) =>
        request<{ ok: boolean }>(`/admin/cms/media/${id}`, { method: "DELETE" }),
      navigation: () => request<import("./types").CmsNavMenu[]>("/admin/cms/navigation"),
      saveNavigation: (location: string, items: import("./types").CmsNavItem[]) =>
        request<import("./types").CmsNavMenu>(`/admin/cms/navigation/${location}`, {
          method: "PATCH",
          body: JSON.stringify({ items }),
        }),
      settings: () => request<Record<string, string>>("/admin/cms/settings"),
      updateSettings: (payload: Record<string, string>) =>
        request<Record<string, string>>("/admin/cms/settings", {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
    },
  },
};

function buildAdminQuery(params?: Record<string, string | number | boolean | undefined | null>) {
  const q = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") q.set(key, String(value));
    });
  }
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}
