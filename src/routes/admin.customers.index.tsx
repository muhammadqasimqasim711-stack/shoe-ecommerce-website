import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Download, LayoutDashboard, Filter, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { CUSTOMER_SEGMENTS, formatMoney } from "@/lib/staff";

import { z } from "zod";

const customerSearchSchema = z.object({
  search: z.string().optional(),
  segment: z.string().optional(),
  page: z.number().int().positive().optional().catch(1),
});

export const Route = createFileRoute("/admin/customers/")({
  validateSearch: (search) => customerSearchSchema.parse(search),
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const search = searchParams?.search ?? "";
  const segment = searchParams?.segment ?? "";
  const page = searchParams?.page ?? 1;

  const updateFilters = (patch: { search?: string; segment?: string; page?: number }) => {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...patch };
        if (!next.search) delete next.search;
        if (!next.segment) delete next.segment;
        if (next.page === 1) delete next.page;
        return next;
      },
      replace: true,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers", search, segment, page],
    queryFn: () =>
      api.admin.customers({
        search: search || undefined,
        segment: segment || undefined,
        page,
        limit: 25,
      }),
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 25;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const exportCsv = () => {
    if (items.length === 0) {
      toast.error("No customer records to export");
      return;
    }
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Orders",
      "Total Spent",
      "Last Order",
      "Segments",
      "Status",
    ];
    const rows = items.map((c) => [
      c.id,
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${(c.phone || "").replace(/"/g, '""')}"`,
      c.totalOrders,
      c.totalSpending,
      c.lastOrder ? new Date(c.lastOrder.createdAt).toLocaleDateString() : "",
      `"${(c.segments ?? []).join(", ")}"`,
      c.accountStatus || (c.disabled ? "disabled" : "active"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${items.length} customers to CSV`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Directory"
        description={`${total} customer account${total === 1 ? "" : "s"} registered`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/crm">
                <LayoutDashboard className="mr-1.5 h-4 w-4" /> CRM Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/segments">
                <Filter className="mr-1.5 h-4 w-4" /> Segments
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={items.length === 0}>
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search email, name, phone…"
            value={search}
            onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
            className="pl-9 text-xs"
          />
        </div>
        <select
          value={segment}
          onChange={(e) => updateFilters({ segment: e.target.value, page: 1 })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs"
        >
          <option value="">All Segments</option>
          {CUSTOMER_SEGMENTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {(search || segment) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-9"
            onClick={() => updateFilters({ search: "", segment: "", page: 1 })}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <DataTable
        columns={[
          "Customer",
          "Phone",
          "Orders",
          "Spent",
          "Last order",
          "Segments",
          "Status",
          "Actions",
        ]}
        loading={isLoading}
        isEmpty={items.length === 0}
      >
        {items.map((c) => (
          <tr key={c.id} className="border-b border-border/60 hover:bg-muted/40 text-xs">
            <td className="p-3">
              <Link
                to="/admin/customers/$id"
                params={{ id: c.id }}
                className="font-semibold text-foreground hover:text-accent hover:underline block"
              >
                {c.name || c.email}
              </Link>
              <div className="text-[11px] text-muted-foreground">{c.email}</div>
            </td>
            <td className="p-3 text-muted-foreground">{c.phone ?? "—"}</td>
            <td className="p-3 font-medium">{c.totalOrders}</td>
            <td className="p-3 font-bold text-accent">{formatMoney(c.totalSpending)}</td>
            <td className="p-3 text-muted-foreground">
              {c.lastOrder ? new Date(c.lastOrder.createdAt).toLocaleDateString() : "—"}
            </td>
            <td className="p-3">
              <div className="flex flex-wrap gap-1">
                {(c.segments ?? []).length === 0 ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  (c.segments ?? []).map((s) => (
                    <span
                      key={s}
                      className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </td>
            <td className="p-3">
              <StatusBadge status={c.accountStatus || (c.disabled ? "disabled" : "active")} />
            </td>
            <td className="p-3 text-right">
              <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                <Link to="/admin/customers/$id" params={{ id: c.id }}>
                  Profile
                </Link>
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
              className="text-xs h-8"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateFilters({ page: page + 1 })}
              className="text-xs h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
