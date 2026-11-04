export const STAFF_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'PRODUCT_MANAGER',
  'ORDER_MANAGER',
  'CUSTOMER_SUPPORT',
  'MARKETING_MANAGER',
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role?: string | null): boolean {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

/** Permission actions seeded and checked by role groups */
export const PERMISSIONS = {
  DASHBOARD: 'dashboard:read',
  PRODUCTS: 'products:manage',
  CATEGORIES: 'categories:manage',
  INVENTORY: 'inventory:manage',
  REVIEWS: 'reviews:manage',
  ORDERS: 'orders:manage',
  RETURNS: 'returns:manage',
  PAYMENTS: 'payments:read',
  SHIPPING: 'shipping:manage',
  CUSTOMERS: 'customers:manage',
  COUPONS: 'coupons:manage',
  ANALYTICS: 'analytics:read',
  ADMIN_USERS: 'admin_users:manage',
  AUDIT: 'audit:read',
  SETTINGS: 'settings:manage',
  NOTIFICATIONS: 'notifications:manage',
  CMS_VIEW: 'cms:view',
  CMS_CREATE: 'cms:create',
  CMS_UPDATE: 'cms:update',
  CMS_DELETE: 'cms:delete',
  CMS_PUBLISH: 'cms:publish',
  MEDIA_UPLOAD: 'media:upload',
  MEDIA_DELETE: 'media:delete',
  SEO_MANAGE: 'seo:manage',
} as const;

export const CMS_PERMISSIONS = [
  PERMISSIONS.CMS_VIEW,
  PERMISSIONS.CMS_CREATE,
  PERMISSIONS.CMS_UPDATE,
  PERMISSIONS.CMS_DELETE,
  PERMISSIONS.CMS_PUBLISH,
  PERMISSIONS.MEDIA_UPLOAD,
  PERMISSIONS.MEDIA_DELETE,
  PERMISSIONS.SEO_MANAGE,
] as const;

export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: Object.values(PERMISSIONS).filter((p) => p !== PERMISSIONS.ADMIN_USERS),
  PRODUCT_MANAGER: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.PRODUCTS,
    PERMISSIONS.CATEGORIES,
    PERMISSIONS.INVENTORY,
    PERMISSIONS.REVIEWS,
    PERMISSIONS.NOTIFICATIONS,
  ],
  ORDER_MANAGER: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.ORDERS,
    PERMISSIONS.RETURNS,
    PERMISSIONS.PAYMENTS,
    PERMISSIONS.SHIPPING,
    PERMISSIONS.NOTIFICATIONS,
  ],
  CUSTOMER_SUPPORT: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.CUSTOMERS,
    PERMISSIONS.ORDERS,
    PERMISSIONS.RETURNS,
    PERMISSIONS.REVIEWS,
    PERMISSIONS.NOTIFICATIONS,
  ],
  MARKETING_MANAGER: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.COUPONS,
    PERMISSIONS.ANALYTICS,
    PERMISSIONS.NOTIFICATIONS,
    PERMISSIONS.CMS_VIEW,
    PERMISSIONS.CMS_CREATE,
    PERMISSIONS.CMS_UPDATE,
    PERMISSIONS.CMS_PUBLISH,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.SEO_MANAGE,
  ],
};

/** ADMIN role kept for backward compatibility — treat as full store admin */
export function roleHasPermission(role: string | undefined, permission: string): boolean {
  if (!role) return false;
  if (role === 'SUPER_ADMIN') return true;
  if (role === 'ADMIN') {
    return permission !== PERMISSIONS.ADMIN_USERS
      ? true
      : false; // ADMIN cannot manage staff; SUPER_ADMIN can. Plan: Admin has general store management.
  }
  const list = ROLE_PERMISSIONS[role as StaffRole];
  return list ? list.includes(permission) : false;
}
