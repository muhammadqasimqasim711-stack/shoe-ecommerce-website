import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/support")({
  component: AdminSupportPage,
});

function AdminSupportPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "support"],
    queryFn: () => api.admin.support(100),
  });
  const selected = data.find((m) => m.id === selectedId) ?? data[0] ?? null;

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-6">Support inbox</h1>
      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No support messages yet.</p>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <ul className="rounded-xl border border-border bg-background divide-y divide-border max-h-[70vh] overflow-auto">
            {data.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left p-3 text-sm hover:bg-muted/50 ${
                    selected?.id === m.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="font-medium truncate">{m.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {selected && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="font-semibold">{selected.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{selected.email}</p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
