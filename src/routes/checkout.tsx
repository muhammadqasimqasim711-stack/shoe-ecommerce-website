import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/hooks/use-catalog";
import { useLocale } from "@/hooks/use-locale";
import { api } from "@/lib/api";
import type { CheckoutPreview, ShippingMethod } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — SOLE" },
      { name: "description", content: "Complete your SOLE order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartId, clearLocalCart, isLoading } = useCart();
  const { t, formatMoney } = useLocale();
  const [email, setEmail] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  useEffect(() => {
    if (!cartId || !cart?.items.length) return;

    void (async () => {
      try {
        const rates = await api.getShippingRates({
          cartId,
          country: address.country || "US",
          zipCode: address.zipCode || undefined,
        });
        setMethods(rates.methods);
      } catch {
        /* ignore until address ready */
      }
    })();
  }, [cartId, cart?.items.length, address.country, address.zipCode]);

  useEffect(() => {
    if (!cartId || !cart?.items.length) return;
    void (async () => {
      try {
        const next = await api.checkoutPreview({
          cartId,
          shippingMethod,
          couponCode: cart.couponCode ?? undefined,
        });
        setPreview(next);
      } catch {
        setPreview(null);
      }
    })();
  }, [cartId, cart?.items.length, cart?.couponCode, shippingMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!cartId) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const placed = await api.placeOrder({
        cartId,
        email,
        shippingMethod,
        address: {
          name: address.name,
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
        couponCode: cart?.couponCode ?? undefined,
        paymentMethod: "mock",
      });

      await api.payOrder(placed.orderId, { provider: "mock", cardLast4: "4242" });
      clearLocalCart();
      toast.success("Order confirmed");
      void navigate({
        to: "/orders/$orderId/confirmation",
        params: { orderId: placed.orderId },
      });
    } catch {
      toast.error("Checkout failed. Check details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader showSearch={false} />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-black tracking-tighter mb-3">Nothing to checkout</h1>
          <p className="text-muted-foreground mb-6">Add products to your bag first.</p>
          <Button asChild className="rounded-full">
            <Link to="/shop">Browse shop</Link>
          </Button>
        </main>
      </div>
    );
  }

  const totals = preview;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            <Link to="/cart" className="hover:underline">
              Cart
            </Link>{" "}
            / Checkout
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-8">
            <section className="space-y-3">
              <h2 className="font-display text-xl font-black tracking-tight">Contact</h2>
              <Input
                required
                type="email"
                autoComplete="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black tracking-tight">Shipping address</h2>
              <Input
                required
                autoComplete="name"
                name="fullName"
                placeholder="Full name"
                value={address.name}
                onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))}
              />
              <Input
                required
                autoComplete="address-line1"
                name="addressLine1"
                placeholder="Address line 1"
                value={address.line1}
                onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
              />
              <Input
                autoComplete="address-line2"
                name="addressLine2"
                placeholder="Address line 2"
                value={address.line2}
                onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  required
                  autoComplete="address-level2"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                />
                <Input
                  required
                  autoComplete="address-level1"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  required
                  autoComplete="postal-code"
                  name="postalCode"
                  placeholder="ZIP"
                  value={address.zipCode}
                  onChange={(e) => setAddress((a) => ({ ...a, zipCode: e.target.value }))}
                />
                <Input
                  required
                  autoComplete="country-name"
                  name="country"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                />
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black tracking-tight">Shipping method</h2>
              <div className="space-y-2">
                {(methods.length
                  ? methods
                  : [
                      {
                        id: "standard" as const,
                        label: "Standard Shipping",
                        amount: 5.99,
                        etaDays: 5,
                      },
                      {
                        id: "express" as const,
                        label: "Express Shipping",
                        amount: 14.99,
                        etaDays: 2,
                      },
                    ]
                ).map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer ${
                      shippingMethod === m.id ? "border-accent bg-accent/5" : "border-border"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === m.id}
                        onChange={() => setShippingMethod(m.id)}
                      />
                      <span>
                        <span className="font-medium block">{m.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.etaDays} day delivery
                        </span>
                      </span>
                    </span>
                    <span className="font-semibold">
                      {m.amount === 0 ? t("free") : formatMoney(m.amount)}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black tracking-tight">Payment</h2>
              <p className="text-sm text-muted-foreground">
                Mock payment for local checkout — no real charge. Card ending in 4242.
              </p>
            </section>
          </div>

          <aside className="rounded-2xl border border-border bg-muted/30 p-6 h-fit space-y-4">
            <h2 className="font-display text-xl font-black tracking-tight">Order summary</h2>
            <div className="space-y-2 text-sm">
              {(cart?.items ?? []).map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span className="truncate">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>{formatMoney(totals?.subtotal ?? cart?.subtotal ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("discount")}</span>
                <span>-{formatMoney(totals?.discount ?? cart?.discount ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span>
                  {(totals?.shipping ?? 0) === 0 ? t("free") : formatMoney(totals?.shipping ?? 0)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>{t("total")}</span>
                <span>{formatMoney(totals?.total ?? cart?.total ?? cart?.subtotal ?? 0)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">{t("paidInUsd")}</p>
            </div>
            <Button type="submit" className="w-full rounded-full h-11" disabled={submitting}>
              {submitting ? "Placing order…" : "Place order & pay"}
            </Button>
          </aside>
        </form>
      </main>
    </div>
  );
}
