import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/shipping")({
  component: AdminShippingPage,
});

function AdminShippingPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "shipping"],
    queryFn: () => api.admin.shippingSettings(),
  });

  const [freeShippingThreshold, setFreeShippingThreshold] = useState("100");
  const [shippingMethodsJson, setShippingMethodsJson] = useState("[]");
  const [shippingZonesJson, setShippingZonesJson] = useState("[]");

  useEffect(() => {
    if (!data) return;
    setFreeShippingThreshold(String(data.freeShippingThreshold ?? 100));
    setShippingMethodsJson(String(data.shippingMethodsJson ?? "[]"));
    setShippingZonesJson(String(data.shippingZonesJson ?? "[]"));
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      api.admin.updateShippingSettings({
        freeShippingThreshold: Number(freeShippingThreshold),
        shippingMethodsJson,
        shippingZonesJson,
      }),
    onSuccess: () => {
      toast.success("Shipping settings saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "shipping"] });
    },
    onError: () => toast.error("Could not save shipping settings"),
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Shipping settings"
        description="Rates, zones, and free-shipping threshold"
      />
      <form
        className="space-y-4 rounded-xl border border-border bg-background p-5"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
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
        <div className="space-y-2">
          <Label>Shipping methods (JSON)</Label>
          <Textarea
            rows={6}
            value={shippingMethodsJson}
            onChange={(e) => setShippingMethodsJson(e.target.value)}
            className="font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label>Shipping zones (JSON)</Label>
          <Textarea
            rows={6}
            value={shippingZonesJson}
            onChange={(e) => setShippingZonesJson(e.target.value)}
            className="font-mono text-xs"
          />
        </div>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
