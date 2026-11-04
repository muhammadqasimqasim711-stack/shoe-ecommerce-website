import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { ProductImage } from "@/components/product-image";
import { useLocale } from "@/hooks/use-locale";
import { api } from "@/lib/api";

export const Route = createFileRoute("/orders/$orderId/confirmation")({
  head: () => ({
    meta: [
      { title: "Order confirmed — SOLE" },
      { name: "description", content: "Your SOLE order confirmation." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderId } = Route.useParams();
  const { formatMoney, t } = useLocale();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", "confirmation", orderId],
    queryFn: () => api.getOrderConfirmation(orderId),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader showSearch={false} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : isError || !data ? (
          <div className="text-center py-16">
            <h1 className="text-3xl font-black tracking-tighter mb-3">Order not found</h1>
            <Button asChild className="rounded-full">
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
              <h1 className="text-4xl font-black tracking-tighter">Order confirmed</h1>
              <p className="text-muted-foreground">
                Thanks{data.email ? `, ${data.email}` : ""}. Status:{" "}
                <span className="font-semibold text-foreground">{data.status}</span>
              </p>
              <p className="text-xs text-muted-foreground font-mono">Order ID: {data.orderId}</p>
            </div>

            <section className="rounded-2xl border border-border p-6 space-y-4">
              <h2 className="font-display text-xl font-black tracking-tight">Items</h2>
              {data.items.map((item, i) => (
                <div key={`${item.name}-${i}`} className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    <ProductImage
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase text-muted-foreground">{item.brand}</div>
                    <div className="font-semibold truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {item.quantity}</div>
                  </div>
                  <div className="font-bold">{formatMoney(item.price * item.quantity)}</div>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-border p-6 space-y-2 text-sm">
              <h2 className="font-display text-xl font-black tracking-tight mb-3">
                {t("shipping")}
              </h2>
              <p className="font-medium capitalize">
                {data.shipping.method ?? "standard"} · {formatMoney(data.shipping.cost)}
              </p>
              <p>
                {data.shipping.address.name}
                <br />
                {data.shipping.address.line1}
                {data.shipping.address.line2 ? (
                  <>
                    <br />
                    {data.shipping.address.line2}
                  </>
                ) : null}
                <br />
                {data.shipping.address.city}, {data.shipping.address.state}{" "}
                {data.shipping.address.zipCode}
                <br />
                {data.shipping.address.country}
              </p>
            </section>

            <section className="rounded-2xl border border-border p-6 space-y-2 text-sm">
              <h2 className="font-display text-xl font-black tracking-tight mb-3">Payment</h2>
              <p>
                {data.payment
                  ? `${data.payment.provider} · ${data.payment.status} · ${formatMoney(data.payment.amount)}`
                  : "Pending"}
              </p>
              <div className="border-t border-border pt-3 mt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{formatMoney(data.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("discount")}</span>
                  <span>-{formatMoney(data.totals.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span>{formatMoney(data.totals.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>{t("total")}</span>
                  <span>
                    {formatMoney(data.totals.total)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({data.totals.currency})
                    </span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pt-2">{t("paidInUsd")}</p>
              </div>
            </section>

            <div className="text-center">
              <Button asChild className="rounded-full">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
