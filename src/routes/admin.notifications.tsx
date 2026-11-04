import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: () => api.admin.notifications(50),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.admin.markNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });

  const markAll = useMutation({
    mutationFn: () => api.admin.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success("All notifications marked read");
      void queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
    onError: () => toast.error("Could not mark all read"),
  });

  const unread = data.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread` : "You're all caught up"}
        actions={
          <Button
            variant="outline"
            disabled={!unread || markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            Mark all read
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="space-y-2">
          {data.length === 0 && <p className="text-sm text-muted-foreground">No notifications.</p>}
          {data.map((n) => (
            <article
              key={n.id}
              className={`rounded-xl border border-border p-4 ${n.read ? "bg-background" : "bg-accent/5 border-accent/30"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-sm">{n.title}</h3>
                  {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {n.link && (
                    <Link
                      to={n.link as "/admin"}
                      className="mt-2 inline-block text-xs text-accent hover:underline"
                    >
                      Open
                    </Link>
                  )}
                </div>
                {!n.read && (
                  <Button size="sm" variant="outline" onClick={() => markRead.mutate(n.id)}>
                    Mark read
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
