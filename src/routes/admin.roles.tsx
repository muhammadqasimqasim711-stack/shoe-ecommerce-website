import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/roles")({
  component: AdminRolesPage,
});

function AdminRolesPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: () => api.admin.roles(),
  });

  const allPermissions = Array.from(
    new Set(data.flatMap((r) => r.permissions.map((p) => p.action))),
  ).sort();

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        description="Read-only matrix of staff capabilities"
      />

      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Permission</th>
                {data.map((r) => (
                  <th key={r.id} className="p-3 font-medium whitespace-nowrap">
                    <div>{r.name.replaceAll("_", " ")}</div>
                    <div className="text-xs font-normal">{r.userCount} users</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((perm) => (
                <tr key={perm} className="border-b border-border/60">
                  <td className="p-3 font-mono text-xs">{perm}</td>
                  {data.map((r) => {
                    const has = r.permissions.some((p) => p.action === perm);
                    return (
                      <td key={r.id} className="p-3 text-center">
                        {has ? (
                          <span className="text-emerald-600">✓</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">No roles found.</p>
          )}
        </div>
      )}
    </div>
  );
}
