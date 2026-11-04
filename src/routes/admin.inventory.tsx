import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";

const inventorySearchSchema = z.object({
  search: z.string().optional(),
  lowStock: z.boolean().optional().catch(false),
  page: z.number().int().positive().optional().catch(1),
});

export const Route = createFileRoute("/admin/inventory")({
  validateSearch: (search) => inventorySearchSchema.parse(search),
  component: AdminInventoryPage,
});

function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const search = searchParams?.search ?? "";
  const lowStock = !!searchParams?.lowStock;
  const page = searchParams?.page ?? 1;

  const updateFilters = (patch: { search?: string; lowStock?: boolean; page?: number }) => {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...patch };
        if (!next.search) delete next.search;
        if (!next.lowStock) delete next.lowStock;
        if (next.page === 1) delete next.page;
        return next;
      },
      replace: true,
    });
  };

  const [adjusting, setAdjusting] = useState<{
    id: string;
    productName: string;
    stock: number;
  } | null>(null);
  const [mode, setMode] = useState<"increase" | "decrease" | "set">("set");
  const [quantity, setQuantity] = useState("0");
  const [reason, setReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "inventory", search, lowStock, page],
    queryFn: () =>
      api.admin.inventory({
        search: search || undefined,
        lowStock: lowStock ? "true" : undefined,
        page,
        limit: 50,
      }),
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const adjust = useMutation({
    mutationFn: () =>
      api.admin.adjustStock(adjusting!.id, {
        mode,
        quantity: Number(quantity),
        reason: reason.trim(),
      }),
    onSuccess: () => {
      toast.success("Stock updated");
      setAdjusting(null);
      setReason("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => toast.error("Could not adjust stock"),
  });

  return (
    <div>
      <PageHeader title="Inventory" description={`${total} variants`} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search product or SKU…"
          value={search}
          onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
          className="max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => updateFilters({ lowStock: e.target.checked, page: 1 })}
          />
          Low stock only
        </label>
      </div>

      <DataTable
        columns={["Product", "SKU", "Size", "Color", "Stock", "Reserved", "Available", ""]}
        loading={isLoading}
        isEmpty={items.length === 0}
      >
        {items.map((row) => (
          <tr
            key={row.id}
            className={`border-b border-border/60 hover:bg-muted/40 ${row.lowStock ? "bg-amber-50/50" : ""}`}
          >
            <td className="p-3">
              <Link
                to="/admin/products/$id"
                params={{ id: row.productId }}
                className="text-accent hover:underline"
              >
                {row.productName}
              </Link>
            </td>
            <td className="p-3 text-muted-foreground">{row.sku ?? "—"}</td>
            <td className="p-3">{row.size ?? "—"}</td>
            <td className="p-3">{row.color ?? "—"}</td>
            <td className="p-3 font-medium">{row.stock}</td>
            <td className="p-3">{row.reservedStock}</td>
            <td className="p-3">{row.available}</td>
            <td className="p-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAdjusting({ id: row.id, productName: row.productName, stock: row.stock });
                  setQuantity(String(row.stock));
                  setMode("set");
                }}
              >
                Adjust
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateFilters({ page: page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!adjusting} onOpenChange={(open) => !open && setAdjusting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust stock — {adjusting?.productName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Current stock: {adjusting?.stock}</p>
            <div className="space-y-2">
              <Label>Mode</Label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="set">Set exact</option>
                <option value="increase">Increase by</option>
                <option value="decrease">Decrease by</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjusting(null)}>
              Cancel
            </Button>
            <Button disabled={!reason.trim() || adjust.isPending} onClick={() => adjust.mutate()}>
              {adjust.isPending ? "Saving…" : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
