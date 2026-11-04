import { STAFF_ROLES, isStaffRole } from "./types";

export { STAFF_ROLES, isStaffRole };

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
] as const;

export const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "OUT_OF_STOCK", "ARCHIVED"] as const;

export const RETURN_STATUSES = [
  "Requested",
  "Approved",
  "Rejected",
  "Item Received",
  "Refund Processing",
  "Refunded",
  "Closed",
] as const;

export const CUSTOMER_SEGMENTS = [
  { value: "new", label: "New" },
  { value: "returning", label: "Returning" },
  { value: "vip", label: "VIP" },
  { value: "high_spending", label: "High spending" },
  { value: "inactive", label: "Inactive" },
] as const;

export function formatMoney(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function buildQuery(params?: Record<string, string | number | boolean | undefined | null>) {
  const q = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") q.set(key, String(value));
    });
  }
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

export function formatDate(
  dateInput: string | number | Date | null | undefined,
  fallback = "—",
): string {
  if (!dateInput) return fallback;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString();
}

export function formatDateTime(
  dateInput: string | number | Date | null | undefined,
  fallback = "—",
): string {
  if (!dateInput) return fallback;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleString();
}
