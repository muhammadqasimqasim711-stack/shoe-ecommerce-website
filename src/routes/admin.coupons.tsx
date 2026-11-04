import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { api } from "@/lib/api";
import type { AdminCoupon } from "@/lib/types";

const emptyForm = {
  code: "",
  description: "",
  discountType: "percent",
  discountValue: "10",
  maxDiscount: "",
  usageLimit: "",
  minOrderValue: "",
  active: true,
};

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCouponsPage,
});

function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => api.admin.coupons(),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(c: AdminCoupon) {
    setEditing(c);
    setForm({
      code: c.code,
      description: c.description ?? "",
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : "",
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
      minOrderValue: c.minOrderValue != null ? String(c.minOrderValue) : "",
      active: c.active,
    });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        code: form.code.trim(),
        description: form.description || undefined,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
        active: form.active,
      };
      if (editing) return api.admin.updateCoupon(editing.id, payload);
      return api.admin.createCoupon(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Coupon updated" : "Coupon created");
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: () => toast.error("Could not save coupon"),
  });

  const remove = useMutation({
    mutationFn: () => api.admin.deleteCoupon(deleteId!),
    onSuccess: () => {
      toast.success("Coupon deleted");
      setDeleteId(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: () => toast.error("Could not delete coupon"),
  });

  return (
    <div>
      <PageHeader title="Coupons" actions={<Button onClick={openCreate}>Add coupon</Button>} />

      <DataTable
        columns={["Code", "Type", "Value", "Used", "Status", ""]}
        loading={isLoading}
        isEmpty={data.length === 0}
      >
        {data.map((c) => (
          <tr key={c.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="p-3 font-medium">{c.code}</td>
            <td className="p-3">{c.discountType}</td>
            <td className="p-3">
              {c.discountType === "percent" ? `${c.discountValue}%` : c.discountValue}
            </td>
            <td className="p-3">
              {c.usedCount ?? 0}
              {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
            </td>
            <td className="p-3">
              <StatusBadge status={c.active ? "active" : "disabled"} />
            </td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => setDeleteId(c.id)}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit coupon" : "New coupon"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed</option>
                  <option value="free_shipping">Free shipping</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Usage limit</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Min order</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              Active
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!form.code.trim() || save.isPending} onClick={() => save.mutate()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete coupon?"
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
