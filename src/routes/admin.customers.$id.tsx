import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Edit,
  RotateCcw,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { api } from "@/lib/api";
import { formatMoney, formatDate, formatDateTime } from "@/lib/staff";

export const Route = createFileRoute("/admin/customers/$id")({
  component: AdminCustomerDetailPage,
});

function AdminCustomerDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const [note, setNote] = useState("");
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "customer", id],
    queryFn: () => api.admin.customer(id),
  });

  useEffect(() => {
    if (data) {
      setFirstName(String(data.firstName || ""));
      setLastName(String(data.lastName || ""));
      setPhone(String(data.phone || ""));
    }
  }, [data]);

  const toggleDisabled = useMutation({
    mutationFn: (disabled: boolean) => api.admin.updateCustomer(id, { disabled }),
    onSuccess: () => {
      toast.success("Customer status updated");
      setConfirmDisable(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", "customer", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "crm"] });
    },
    onError: () => toast.error("Could not update customer"),
  });

  const updateProfile = useMutation({
    mutationFn: () =>
      api.admin.updateCustomer(id, {
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        phone: phone.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Customer profile updated");
      setIsEditing(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", "customer", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "crm"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const addNote = useMutation({
    mutationFn: () => api.admin.addCustomerNote(id, note.trim()),
    onSuccess: () => {
      toast.success("Note added");
      setNote("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "customer", id] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "crm"] });
    },
    onError: () => toast.error("Could not add note"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <PageHeader title="Customer Details" backTo="/admin/customers" backLabel="Customers" />
        <div className="rounded-xl border border-border p-6 text-center text-destructive">
          Customer not found or failed to load.
        </div>
      </div>
    );
  }

  const metrics =
    (data.metrics as {
      totalOrders?: number;
      totalSpending?: number;
      averageOrderValue?: number;
      lastOrderAt?: string | null;
    }) ?? {};

  const segments = (data.segments as string[]) ?? [];
  const orders = (data.orders as Array<Record<string, unknown>>) ?? [];
  const addresses = (data.addresses as Array<Record<string, unknown>>) ?? [];
  const notes = ((data.notes ?? data.customerNotes) as Array<Record<string, unknown>>) ?? [];
  const returns = (data.returns as Array<Record<string, unknown>>) ?? [];
  const disabled = Boolean(data.disabled);

  const customerName =
    [data.firstName, data.lastName].filter(Boolean).join(" ") || "No name registered";

  return (
    <div className="space-y-8">
      {/* Header with status and quick actions */}
      <PageHeader
        title={String(data.email)}
        description={`${customerName} · Registered ${formatDate((data.registration || data.createdAt) as string)}`}
        backTo="/admin/customers"
        backLabel="Customers"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit Profile
            </Button>
            <StatusBadge status={disabled ? "disabled" : "active"} />
            <Button
              variant={disabled ? "default" : "destructive"}
              size="sm"
              onClick={() => setConfirmDisable(true)}
            >
              {disabled ? "Enable Account" : "Disable Account"}
            </Button>
          </div>
        }
      />

      {/* Segments Badge Row */}
      {segments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 -mt-4">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Assigned Segments:
          </span>
          {segments.map((seg) => (
            <Link
              key={seg}
              to="/admin/segments"
              search={{ segment: seg }}
              className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold uppercase text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {seg}
            </Link>
          ))}
        </div>
      )}

      {/* Customer Lifetime Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Total Spend</span>
            <DollarSign className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold text-accent">
            {formatMoney(Number(metrics.totalSpending || 0))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Cumulative lifetime value</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{metrics.totalOrders || 0}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Non-cancelled purchases</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Average Order Value</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold">
            {formatMoney(Number(metrics.averageOrderValue || 0))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">AOV across all orders</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Last Order</span>
            <Calendar className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-lg font-bold truncate">
            {formatDate(metrics.lastOrderAt, "No orders yet")}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Most recent activity</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 cols: Orders, Returns, Addresses */}
        <div className="space-y-8 lg:col-span-2">
          {/* Order History */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-accent" /> Order History ({orders.length})
              </h2>
            </div>

            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No orders placed by this customer.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border/60 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {orders.map((o) => (
                      <tr key={String(o.id)} className="hover:bg-muted/30">
                        <td className="py-3">
                          <Link
                            to="/admin/orders/$id"
                            params={{ id: String(o.id) }}
                            className="font-medium text-accent hover:underline font-mono text-xs"
                          >
                            {String(o.id).slice(0, 8)}…
                          </Link>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">
                          {formatDate(o.createdAt as string)}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={String(o.status)} />
                        </td>
                        <td className="py-3 text-xs">{Number(o.itemCount || 1)} items</td>
                        <td className="py-3 text-right font-bold">
                          {formatMoney(Number(o.totalAmount), String(o.currency || "USD"))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Returns & Refunds (if applicable) */}
          {returns.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-amber-500" /> Return Requests ({returns.length})
              </h2>
              <div className="divide-y divide-border/60">
                {returns.map((r) => (
                  <div
                    key={String(r.id)}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-xs">
                        Reason: {String(r.reason || "Not specified")}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Order #{String(r.orderId || "").slice(0, 8)}… ·{" "}
                        {formatDate(r.createdAt as string)}
                      </p>
                    </div>
                    <StatusBadge status={String(r.status)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Saved Addresses */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" /> Saved Addresses ({addresses.length})
            </h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2 text-center">
                No addresses on file.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <div
                    key={String(a.id)}
                    className="rounded-lg border border-border p-3.5 text-xs space-y-1 bg-background/50"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>
                        {Boolean(a.isDefault) && (
                          <span className="text-accent text-[10px] font-bold uppercase mr-1.5">
                            [Default]
                          </span>
                        )}
                        Address
                      </span>
                    </div>
                    <p className="text-foreground">{String(a.line1)}</p>
                    {a.line2 ? <p className="text-muted-foreground">{String(a.line2)}</p> : null}
                    <p className="text-muted-foreground">
                      {String(a.city)}, {String(a.state)} {String(a.zipCode)}
                    </p>
                    <p className="text-muted-foreground font-mono text-[11px]">
                      {String(a.country)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right col: Contact Info & Internal Staff Notes */}
        <div className="space-y-8">
          {/* Contact Details Card */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Contact Information</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
            <div className="space-y-2 text-xs divide-y divide-border/40">
              <div className="pt-2 first:pt-0">
                <span className="text-muted-foreground block text-[11px]">Full Name</span>
                <span className="font-medium text-foreground">{customerName}</span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block text-[11px]">Email Address</span>
                <a
                  href={`mailto:${data.email}`}
                  className="font-medium text-accent hover:underline"
                >
                  {String(data.email)}
                </a>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block text-[11px]">Phone</span>
                <span className="font-medium text-foreground">{String(data.phone || "—")}</span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block text-[11px]">Account Status</span>
                <span className="font-medium capitalize">{disabled ? "Disabled" : "Active"}</span>
              </div>
            </div>
          </section>

          {/* Internal Staff Notes */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-sm flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-accent" /> Internal Staff Notes ({notes.length}
              )
            </h2>

            <div className="space-y-2">
              <Textarea
                rows={3}
                placeholder="Log customer phone call, VIP preference, or support interaction…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                disabled={!note.trim() || addNote.isPending}
                onClick={() => addNote.mutate()}
                className="w-full text-xs"
              >
                {addNote.isPending ? "Adding…" : "Add Staff Note"}
              </Button>
            </div>

            {notes.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No internal notes logged yet.
              </p>
            ) : (
              <div className="space-y-2.5 pt-2 border-t border-border/60 max-h-96 overflow-y-auto">
                {notes.map((n) => {
                  const author = n.author as
                    { email?: string; firstName?: string; lastName?: string } | undefined;
                  const authorName =
                    [author?.firstName, author?.lastName].filter(Boolean).join(" ") ||
                    author?.email ||
                    "Staff";
                  return (
                    <div
                      key={String(n.id)}
                      className="rounded-lg border border-border/80 bg-background/50 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">{authorName}</span>
                        <span>{formatDateTime(n.createdAt as string)}</span>
                      </div>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {String(n.body)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Disable Dialog */}
      <ConfirmDialog
        open={confirmDisable}
        onOpenChange={setConfirmDisable}
        title={disabled ? "Enable customer account?" : "Disable customer account?"}
        description={
          disabled
            ? "The customer will be able to log in and make purchases again."
            : "The customer will be prevented from signing in to their account."
        }
        confirmLabel={disabled ? "Enable Account" : "Disable Account"}
        destructive={!disabled}
        loading={toggleDisabled.isPending}
        onConfirm={() => toggleDisabled.mutate(!disabled)}
      />
    </div>
  );
}
