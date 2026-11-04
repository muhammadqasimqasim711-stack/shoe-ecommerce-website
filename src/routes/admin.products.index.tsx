import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, MoreHorizontal, Pencil, Archive, RotateCcw, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { api } from "@/lib/api";
import { formatMoney, PRODUCT_STATUSES } from "@/lib/staff";
import { z } from "zod";

const productSearchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().int().positive().optional().catch(1),
});

export const Route = createFileRoute("/admin/products/")({
  validateSearch: (search) => productSearchSchema.parse(search),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const search = searchParams?.search ?? "";
  const status = searchParams?.status ?? "";
  const sort = searchParams?.sort ?? "updated_desc";
  const page = searchParams?.page ?? 1;

  const [confirm, setConfirm] = useState<{
    id: string;
    action: "archive" | "delete" | "restore";
  } | null>(null);

  const updateFilters = (patch: {
    search?: string;
    status?: string;
    sort?: string;
    page?: number;
  }) => {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...patch };
        if (!next.search) delete next.search;
        if (!next.status) delete next.status;
        if (!next.sort || next.sort === "updated_desc") delete next.sort;
        if (next.page === 1) delete next.page;
        return next;
      },
      replace: true,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products", search, status, sort, page],
    queryFn: () =>
      api.admin.products({
        search: search || undefined,
        status: status || undefined,
        sort,
        page,
        limit: 20,
      }),
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const action = useMutation({
    mutationFn: async () => {
      if (!confirm) return;
      if (confirm.action === "archive") return api.admin.archiveProduct(confirm.id);
      if (confirm.action === "restore") return api.admin.restoreProduct(confirm.id);
      return api.admin.deleteProduct(confirm.id);
    },
    onSuccess: () => {
      toast.success(
        confirm?.action === "delete"
          ? "Product deleted"
          : confirm?.action === "restore"
            ? "Product restored"
            : "Product archived",
      );
      setConfirm(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => toast.error("Action failed"),
  });

  const duplicate = useMutation({
    mutationFn: (id: string) => api.admin.duplicateProduct(id),
    onSuccess: () => {
      toast.success("Product duplicated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: () => toast.error("Could not duplicate"),
  });

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${total} product${total === 1 ? "" : "s"}`}
        actions={
          <Button asChild>
            <Link to="/admin/products/new">Add product</Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search name or SKU…"
          value={search}
          onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
          className="max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => updateFilters({ status: e.target.value, page: 1 })}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All statuses</option>
          {PRODUCT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="updated_desc">Recently updated</option>
          <option value="name_asc">Name A–Z</option>
          <option value="name_desc">Name Z–A</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="created_desc">Newest</option>
          <option value="created_asc">Oldest</option>
        </select>
      </div>

      <DataTable
        columns={["", "Product", "SKU", "Category", "Price", "Sale", "Stock", "Status", ""]}
        loading={isLoading}
        isEmpty={items.length === 0}
        empty="No products found."
      >
        {items.map((p) => {
          const img = p.image || p.img;
          const cats = (p.categoryNames ?? p.categories ?? []).join(", ") || "—";
          return (
            <tr key={p.id} className="border-b border-border/60 hover:bg-muted/40">
              <td className="p-3">
                {img ? (
                  <img src={img} alt="" className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted" />
                )}
              </td>
              <td className="p-3">
                <Link
                  to="/admin/products/$id"
                  params={{ id: p.id }}
                  className="font-medium text-accent hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              <td className="p-3 text-muted-foreground">{p.sku ?? "—"}</td>
              <td className="p-3 max-w-[140px] truncate">{cats}</td>
              <td className="p-3">{formatMoney(p.price)}</td>
              <td className="p-3">
                {p.compareAtPrice != null && p.compareAtPrice > p.price
                  ? formatMoney(p.compareAtPrice)
                  : "—"}
              </td>
              <td className="p-3">{p.stockTotal}</td>
              <td className="p-3">
                <StatusBadge status={p.status} />
              </td>
              <td className="p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/admin/products/$id" params={{ id: p.id }}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicate.mutate(p.id)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    {p.rawStatus === "ARCHIVED" || p.status === "ARCHIVED" ? (
                      <DropdownMenuItem onClick={() => setConfirm({ id: p.id, action: "restore" })}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Restore
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => setConfirm({ id: p.id, action: "archive" })}>
                        <Archive className="mr-2 h-4 w-4" /> Archive
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setConfirm({ id: p.id, action: "delete" })}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          );
        })}
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

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={
          confirm?.action === "delete"
            ? "Delete product permanently?"
            : confirm?.action === "restore"
              ? "Restore this product?"
              : "Archive this product?"
        }
        description={
          confirm?.action === "delete"
            ? "This cannot be undone."
            : confirm?.action === "restore"
              ? "The product will become available again."
              : "It will be hidden from the storefront."
        }
        confirmLabel={
          confirm?.action === "delete"
            ? "Delete"
            : confirm?.action === "restore"
              ? "Restore"
              : "Archive"
        }
        destructive={confirm?.action === "delete" || confirm?.action === "archive"}
        loading={action.isPending}
        onConfirm={() => action.mutate()}
      />
    </div>
  );
}
