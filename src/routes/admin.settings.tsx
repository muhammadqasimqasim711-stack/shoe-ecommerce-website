import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => api.admin.settings(),
  });

  const [storeName, setStoreName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("100");

  useEffect(() => {
    if (!data) return;
    setStoreName(String(data.storeName ?? ""));
    setCurrency(String(data.currency ?? "USD"));
    setFreeShippingThreshold(String(data.freeShippingThreshold ?? 100));
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      api.admin.updateSettings({
        storeName,
        currency,
        freeShippingThreshold: Number(freeShippingThreshold),
      }),
    onSuccess: () => {
      toast.success("Settings saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: () => toast.error("Could not save settings"),
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Settings" description="Store-wide configuration" />

      <form
        className="space-y-4 rounded-xl border border-border bg-background p-5"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="space-y-2">
          <Label>Store name</Label>
          <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Free shipping threshold</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save settings"}
        </Button>
      </form>

      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="mb-3 font-semibold">Related</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link to="/admin/shipping" className="text-accent hover:underline">
              Shipping settings
            </Link>
          </li>
          <li>
            <Link to="/admin/support" className="text-accent hover:underline">
              Support inbox
            </Link>
          </li>
          <li>
            <Link to="/admin/newsletter" className="text-accent hover:underline">
              Newsletter subscribers
            </Link>
          </li>
          <li>
            <Link to="/admin/brands" className="text-accent hover:underline">
              Brands
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
