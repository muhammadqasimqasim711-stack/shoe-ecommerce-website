import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { formatMoney, ORDER_STATUSES } from "@/lib/staff";

import { z } from "zod";

const ordersSearchSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional().catch(1),
});

export const Route = createFileRoute("/admin/orders/")({
  validateSearch: (search) => ordersSearchSchema.parse(search),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const status = searchParams?.status ?? "";
  const search = searchParams?.search ?? "";
  const page = searchParams?.page ?? 1;

  const updateFilters = (patch: { status?: string; search?: string; page?: number }) => {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...patch };
        if (!next.status) delete next.status;
        if (!next.search) delete next.search;
        if (next.page === 1) delete next.page;
        return next;
      },
      replace: true,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", status, search, page],
    queryFn: () =>
      api.admin.orders({
        status: status || undefined,
        search: search || undefined,
        page,
        limit: 25,
      }),
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 25;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <PageHeader
        title={status === "Shipped" ? "Shipments" : "Orders"}
        description={`${total} order${total === 1 ? "" : "s"}`}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search ID, email, tracking…"
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
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {(search || status) && (
          <button
            type="button"
            onClick={() => updateFilters({ search: "", status: "", page: 1 })}
            className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <DataTable
        columns={["Order", "Customer", "Status", "Payment", "Tracking", "Items", "Total", "Date"]}
        loading={isLoading}
        isEmpty={items.length === 0}
      >
        {items.map((o) => (
          <tr key={o.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="p-3">
              <Link
                to="/admin/orders/$id"
                params={{ id: o.id }}
                className="text-accent hover:underline"
              >
                {o.id.slice(0, 8)}…
              </Link>
            </td>
            <td className="p-3">{o.user?.email ?? o.email ?? "—"}</td>
            <td className="p-3">
              <StatusBadge status={o.status} />
            </td>
            <td className="p-3">{o.paymentStatus ?? "—"}</td>
            <td className="p-3 text-muted-foreground">{o.trackingNumber ?? "—"}</td>
            <td className="p-3">{o.itemCount}</td>
            <td className="p-3">{formatMoney(o.totalAmount, o.currency)}</td>
            <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </DataTable>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => updateFilters({ page: page + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
