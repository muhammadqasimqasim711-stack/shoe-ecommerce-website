export type ProductCard = {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  img: string;
  tag?: string;
  colors: string[];
  rating: number;
  reviewCount: number;
  defaultVariantId?: string;
  gender?: string;
};

export type ProductVariantDetail = {
  id: string;
  size?: string | null;
  color?: string | null;
  stock: number;
  sku?: string | null;
};

export type ProductImageDetail = {
  id: string;
  url: string;
  altText?: string | null;
};

export type ProductDetail = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  compareAtPrice?: number | string | null;
  gender?: string | null;
  brand?: { id: string; name: string } | null;
  images: ProductImageDetail[];
  variants: ProductVariantDetail[];
  card: ProductCard;
};

export type Brand = {
  id: string;
  name: string;
  logoUrl?: string | null;
  description?: string | null;
};

export type CategoryCard = {
  id: string;
  name: string;
  count: number;
  imageUrl?: string | null;
};

export type HomeCatalog = {
  products: ProductCard[];
  categories: CategoryCard[];
  brands: string[];
};

export type CartItem = {
  id: string;
  quantity: number;
  variantId: string;
  unitPrice: number;
  lineTotal: number;
  product: {
    id: string;
    name: string;
    brand: string;
    img: string;
    size?: string | null;
    color?: string | null;
  };
};

export type Cart = {
  id: string;
  itemCount: number;
  subtotal: number;
  discount?: number;
  shippingEstimate?: number;
  total?: number;
  couponCode?: string | null;
  freeShippingThreshold: number;
  freeShipping: boolean;
  items: CartItem[];
};

export type ShippingMethod = {
  id: "standard" | "express";
  label: string;
  amount: number;
  etaDays: number;
};

export type CheckoutAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type CheckoutPreview = {
  cartId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
  freeShippingApplied: boolean;
  currency: string;
};

export type PlaceOrderResult = {
  orderId: string;
  total: number;
  currency: string;
  status: string;
  clientSecret: null;
};

export type OrderConfirmation = {
  orderId: string;
  status: string;
  email: string | null;
  createdAt: string;
  items: Array<{
    name: string;
    brand: string;
    img: string;
    size?: string | null;
    color?: string | null;
    quantity: number;
    price: number;
  }>;
  shipping: {
    method: string | null;
    cost: number;
    address: {
      name?: string | null;
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
      country?: string | null;
    };
  };
  payment: {
    provider: string;
    status: string;
    amount: number;
  } | null;
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    currency: string;
  };
};

export type Address = {
  id: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type WishlistItem = {
  id: string;
  variantId: string;
  product: ProductCard & {
    size?: string | null;
    color?: string | null;
  };
};

export type Wishlist = {
  id: string;
  itemCount: number;
  items: WishlistItem[];
};

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type ProductReview = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  authorName: string;
  productId: string;
  productName?: string;
};

export const STAFF_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "PRODUCT_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role?: string | null): boolean {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type AdminStats = {
  totalSales: number;
  todaySales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: AdminOrderListItem[];
  bestSellingProducts: Array<{
    id: string;
    name: string;
    sku: string | null;
    img: string;
    sold: number;
  }>;
  lowStockList: Array<{
    variantId: string;
    productId: string;
    productName: string;
    sku: string | null;
    size: string | null;
    color: string | null;
    stock: number;
    threshold: number;
  }>;
  salesOverview: Array<{ date: string; revenue: number }>;
  orderStatusOverview: Record<string, number>;
  /** @deprecated legacy fields kept optional for compatibility */
  customers?: number;
  products?: number;
  subscribers?: number;
  supportMessages?: number;
  pendingReviews?: number;
  orders?: number;
  orderStatus?: Record<string, number>;
};

export type AdminCustomer = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string;
  phone?: string | null;
  totalOrders: number;
  totalSpending: number;
  lastOrder?: {
    id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
  } | null;
  accountStatus: "active" | "disabled" | string;
  disabled: boolean;
  registration: string;
  segments: string[];
  /** legacy */
  role?: string;
  orderCount?: number;
  createdAt?: string;
};

export type CrmDashboardStats = {
  metrics: {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    totalLtv: number;
    averageLtv: number;
    repeatCustomerRate: number;
    newCustomersThisMonth: number;
  };
  segments: Record<string, number>;
  topCustomers: Array<{
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    name: string;
    phone?: string | null;
    totalOrders: number;
    totalSpending: number;
    segments: string[];
    lastOrderAt: string | null;
    registration: string;
    disabled: boolean;
  }>;
  recentSignups: Array<{
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    name: string;
    phone?: string | null;
    totalOrders: number;
    totalSpending: number;
    segments: string[];
    registration: string;
    disabled: boolean;
  }>;
  recentNotes: Array<{
    id: string;
    body: string;
    createdAt: string;
    author?: { name: string; email: string } | null;
    customer?: { id: string; name: string; email: string } | null;
  }>;
};

export type AdminOrderListItem = {
  id: string;
  status: string;
  email?: string | null;
  user?: { id: string; email: string; firstName?: string | null; lastName?: string | null } | null;
  itemCount: number;
  totalAmount: number;
  currency: string;
  trackingNumber?: string | null;
  shippingStatus?: string | null;
  paymentStatus?: string | null;
  createdAt: string;
};

export type AdminProductListItem = {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  gender?: string | null;
  collection?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  brandId?: string | null;
  brandName?: string | null;
  img: string;
  image?: string;
  categories?: string[];
  categoryNames?: string[];
  status: string;
  rawStatus?: string;
  variantCount: number;
  stockTotal: number;
  reviewCount?: number;
  updatedAt: string;
  createdAt?: string;
  actions?: {
    canEdit: boolean;
    canDuplicate: boolean;
    canArchive: boolean;
    canRestore: boolean;
    canDelete: boolean;
  };
};

export type AdminBrand = {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  productCount: number;
  createdAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  parentId: string | null;
  imageUrl?: string | null;
  order: number | null;
  archived: boolean;
  productCount: number;
  children?: AdminCategory[];
  createdAt?: string;
  updatedAt?: string;
};

export type AdminInventoryItem = {
  id: string;
  productId: string;
  productName: string;
  productSku?: string | null;
  sku?: string | null;
  size?: string | null;
  color?: string | null;
  stock: number;
  reservedStock: number;
  available: number;
  lowStock: boolean;
  threshold: number;
  productStatus: string;
};

export type AdminReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  approved: boolean;
  hidden?: boolean;
  createdAt: string;
  productId: string;
  productName: string;
  authorName: string;
  authorEmail: string;
};

export type AdminCoupon = {
  id: string;
  code: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  maxDiscount?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount?: number;
  minOrderValue?: number | null;
  active: boolean;
  appliesTo?: string;
  productIds?: string[];
  categoryIds?: string[];
};

export type AdminReturnItem = {
  id: string;
  orderId: string;
  status: string;
  reason?: string | null;
  resolution?: string | null;
  refundAmount?: number | null;
  createdAt: string;
  updatedAt?: string;
  order?: { id: string; email?: string | null; totalAmount?: number; status?: string };
};

export type AdminRefundItem = {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  reason?: string | null;
  createdAt: string;
};

export type AdminPaymentItem = {
  id: string;
  orderId: string;
  provider: string;
  status: string;
  amount: number;
  createdAt: string;
  order?: { id: string; email?: string | null; status?: string };
};

export type AdminUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  disabled: boolean;
  role: string;
  roleId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminRole = {
  id: string;
  name: string;
  description?: string | null;
  userCount: number;
  permissions: Array<{ id: string; action: string; description?: string | null }>;
};

export type AdminAuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  userId?: string | null;
  meta?: unknown;
  createdAt: string;
};

export type AdminNotification = {
  id: string;
  title: string;
  body?: string | null;
  type?: string | null;
  read: boolean;
  createdAt: string;
  link?: string | null;
};

export type AdminSettings = {
  storeName: string;
  currency: string;
  freeShippingThreshold: number;
  shippingMethodsJson?: string;
  shippingZonesJson?: string;
  [key: string]: unknown;
};

export type AdminAnalytics = {
  range: { from: string; to: string };
  revenue: number;
  orders: number;
  aov: number;
  bestSelling: Array<{ id: string; name: string; sku: string | null; sold: number }>;
  lowSelling: Array<{ id: string; name: string; sku: string | null; sold: number }>;
  lowStock: Array<{
    variantId: string;
    productId: string;
    productName: string;
    sku: string | null;
    stock: number;
    threshold: number;
  }>;
  newCustomers: number;
  returningCustomers: number;
  ordersByStatus: Record<string, number>;
  cancelled: number;
  returned: number;
};

export type AdminSupportMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type AdminNewsletterSubscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: string;
  published: boolean;
  status: string;
  publishedAt?: string | null;
  featuredImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  updatedAt?: string;
  createdAt?: string;
};

export type CmsHomeSection = {
  id: string;
  key: string;
  title: string;
  enabled?: boolean;
  status?: string;
  sortOrder: number;
  payload: Record<string, unknown>;
  featuredProducts?: Array<{ id: string; name: string; brand: string; price: number; img: string }>;
  featuredCategories?: Array<{ id: string; name: string; imageUrl?: string | null }>;
};

export type CmsBanner = {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  status: string;
  sortOrder: number;
};

export type CmsBlogPost = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  authorName?: string | null;
  category?: string | null;
  status: string;
  publishedAt?: string | null;
  tags: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  updatedAt?: string;
};

export type CmsMedia = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  altText?: string | null;
  createdAt: string;
};

export type CmsNavItem = {
  id?: string;
  label: string;
  url: string;
  sortOrder: number;
  enabled: boolean;
  parentId?: string | null;
};

export type CmsNavMenu = {
  id: string;
  location: string;
  name: string;
  items: CmsNavItem[];
};

export type CmsPublicSettings = {
  storeName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail?: string;
  footerText?: string;
  newsletterHeading?: string;
  newsletterSubtext?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultOgImage?: string;
  social?: Record<string, string>;
  [key: string]: unknown;
};

export type CmsDashboard = {
  publishedPages: number;
  draftPages: number;
  activeBanners: number;
  categories: number;
  blogPosts: number;
  mediaFiles: number;
  recentChanges: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    updatedAt: string;
    entity: string;
  }>;
};
