import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/hooks/use-catalog";
import { useLocale } from "@/hooks/use-locale";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — SOLE" },
      { name: "description", content: "Review your bag and checkout at SOLE." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, isLoading, updateItem, removeItem, applyCoupon, removeCoupon } = useCart();
  const { t, formatMoney } = useLocale();
  const [couponInput, setCouponInput] = useState("");
  const items = cart?.items ?? [];

  const handleQty = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateItem.mutateAsync({ itemId, quantity });
    } catch {
      toast.error("Could not update quantity.");
    }
  };

  const handleRemove = async (itemId: string, name: string) => {
    try {
      await removeItem.mutateAsync(itemId);
      toast.success(`${name} removed`);
    } catch {
      toast.error("Could not remove item.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      await applyCoupon.mutateAsync(couponInput.trim());
      toast.success("Coupon applied");
      setCouponInput("");
    } catch {
      toast.error("Invalid or expired coupon.");
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon.mutateAsync();
      toast.success("Coupon removed");
    } catch {
      toast.error("Could not remove coupon.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            / Cart
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{t("yourBag")}</h1>
        </div>

        {isLoading && !cart ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold tracking-tight mb-2">Your bag is empty</h2>
            <p className="text-muted-foreground mb-6">Add sneakers from the shop to get started.</p>
            <Button asChild className="rounded-full">
              <Link to="/shop">Browse shop</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-10">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Link
                      to="/products/$id"
                      params={{ id: item.product.id }}
                      className="block h-full w-full"
                    >
                      <ProductImage
                        src={item.product.img}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {item.product.brand}
                    </div>
                    <h3 className="font-semibold truncate">
                      <Link
                        to="/products/$id"
                        params={{ id: item.product.id }}
                        className="hover:text-accent transition"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    {(item.product.size || item.product.color) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {[item.product.size, item.product.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          className="h-8 w-8 grid place-items-center"
                          onClick={() => handleQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateItem.isPending}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          className="h-8 w-8 grid place-items-center"
                          onClick={() => handleQty(item.id, item.quantity + 1)}
                          disabled={updateItem.isPending}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(item.id, item.product.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="font-bold whitespace-nowrap">
                    {formatMoney(item.lineTotal, { round: true })}
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-2xl border border-border bg-muted/30 p-6 h-fit space-y-4">
              <h2 className="font-display text-xl font-black tracking-tight">{t("summary")}</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>{formatMoney(cart!.subtotal)}</span>
              </div>
              {(cart!.discount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>
                    {t("discount")}
                    {cart!.couponCode ? ` (${cart!.couponCode})` : ""}
                  </span>
                  <span>-{formatMoney(cart!.discount ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span>
                  {(cart!.shippingEstimate ?? 0) === 0
                    ? t("free")
                    : formatMoney(cart!.shippingEstimate ?? 0)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-4">
                <span>{t("total")}</span>
                <span>{formatMoney(cart!.total ?? cart!.subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("paidInUsd")}</p>
              <div className="pt-2 space-y-2">
                {cart!.couponCode ? (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">Code: {cart!.couponCode}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Try SOLE10 or FREESHIP</p>
              </div>

              <Button asChild className="w-full rounded-full h-11">
                <Link to="/checkout">{t("checkout")}</Link>
              </Button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
