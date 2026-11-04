import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/newsletter")({
  component: AdminNewsletterPage,
});

function AdminNewsletterPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "newsletter"],
    queryFn: () => api.admin.newsletter(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.admin.deleteNewsletter(id),
    onSuccess: () => {
      toast.success("Subscriber removed");
      void queryClient.invalidateQueries({ queryKey: ["admin", "newsletter"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => toast.error("Could not remove subscriber"),
  });

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-6">Newsletter</h1>
      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border bg-background overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Subscribed</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-b border-border/60">
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={remove.isPending}
                      onClick={() => remove.mutate(s.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">No subscribers.</p>
          )}
        </div>
      )}
    </div>
  );
}
