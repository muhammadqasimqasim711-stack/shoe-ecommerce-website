import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/staff";

export const Route = createFileRoute("/admin/audit")({
  component: AdminAuditPage,
});

function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "audit", search],
    queryFn: () => api.admin.auditLogs({ search: search || undefined, limit: 100 }),
  });

  return (
    <div>
      <PageHeader
        title="Audit logs"
        description="Recent admin actions"
        actions={
          <Input
            placeholder="Filter by entity…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        }
      />

      <DataTable
        columns={["When", "Action", "Entity", "Entity ID", "User"]}
        loading={isLoading}
        isEmpty={data.length === 0}
      >
        {data.map((log) => (
          <tr key={log.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
              {formatDateTime(log.createdAt)}
            </td>
            <td className="p-3 font-medium">{log.action}</td>
            <td className="p-3">{log.entity}</td>
            <td className="p-3 font-mono text-xs">{log.entityId?.slice(0, 12) ?? "—"}</td>
            <td className="p-3 text-xs">{log.userId?.slice(0, 8) ?? "—"}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
