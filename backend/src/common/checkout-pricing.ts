export const FREE_SHIPPING_THRESHOLD = 75;

export type ShippingMethodId = 'standard' | 'express';

export type CouponLike = {
  code: string;
  discountType: string;
  discountValue: unknown;
  minOrderValue: unknown;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
  active?: boolean;
  startsAt?: Date | null;
  maxDiscount?: unknown;
};

export function standardShippingAmount(subtotal: number, freeShippingCoupon = false): number {
  if (freeShippingCoupon || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return 5.99;
}

export function expressShippingAmount(): number {
  return 14.99;
}

export function shippingAmount(
  method: ShippingMethodId,
  subtotal: number,
  freeShippingCoupon = false,
): number {
  if (method === 'express') return expressShippingAmount();
  return standardShippingAmount(subtotal, freeShippingCoupon);
}

export function validateCoupon(coupon: CouponLike | null | undefined, subtotal: number) {
  if (!coupon) {
    return { ok: false as const, reason: 'Coupon not found' };
  }
  if (coupon.active === false) {
    return { ok: false as const, reason: 'Coupon inactive' };
  }
  if (coupon.startsAt && coupon.startsAt > new Date()) {
    return { ok: false as const, reason: 'Coupon not started yet' };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { ok: false as const, reason: 'Coupon expired' };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false as const, reason: 'Coupon usage limit reached' };
  }
  if (Number(coupon.minOrderValue) > subtotal) {
    return {
      ok: false as const,
      reason: `Minimum order value is $${Number(coupon.minOrderValue).toFixed(2)}`,
    };
  }
  return { ok: true as const, coupon };
}

export function computeDiscount(coupon: CouponLike | null | undefined, subtotal: number) {
  if (!coupon) {
    return { discount: 0, freeShipping: false, code: null as string | null };
  }
  const check = validateCoupon(coupon, subtotal);
  if (!check.ok) {
    return { discount: 0, freeShipping: false, code: null as string | null };
  }

  if (coupon.discountType === 'free_shipping') {
    return { discount: 0, freeShipping: true, code: coupon.code };
  }
  if (coupon.discountType === 'percent') {
    let discount = Math.round(subtotal * (Number(coupon.discountValue) / 100) * 100) / 100;
    if (coupon.maxDiscount != null) {
      discount = Math.min(discount, Number(coupon.maxDiscount));
    }
    return { discount, freeShipping: false, code: coupon.code };
  }
  if (coupon.discountType === 'fixed') {
    const discount = Math.min(subtotal, Number(coupon.discountValue));
    return { discount, freeShipping: false, code: coupon.code };
  }
  return { discount: 0, freeShipping: false, code: null as string | null };
}

export function computeTotals(input: {
  subtotal: number;
  shippingMethod: ShippingMethodId;
  coupon?: CouponLike | null;
}) {
  const { discount, freeShipping, code } = computeDiscount(input.coupon, input.subtotal);
  const shipping = shippingAmount(input.shippingMethod, input.subtotal, freeShipping);
  const tax = 0;
  const total = Math.round((input.subtotal - discount + shipping + tax) * 100) / 100;
  return {
    subtotal: input.subtotal,
    discount,
    shipping,
    tax,
    total: Math.max(0, total),
    couponCode: code,
    freeShippingApplied: freeShipping || shipping === 0,
  };
}
