import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/cms/homepage")({
  component: CmsHomepagePage,
});

function CmsHomepagePage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "cms", "homepage"],
    queryFn: () => api.admin.cms.homepage(),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.admin.cms.updateHomepageSection(id, payload),
    onSuccess: () => {
      toast.success("Section saved");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "homepage"] });
      void qc.invalidateQueries({ queryKey: ["cms", "home"] });
    },
    onError: () => toast.error("Could not save section"),
  });

  const move = (index: number, dir: -1 | 1) => {
    const next = [...data];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    const tmp = next[index];
    next[index] = next[j];
    next[j] = tmp;
    void api.admin.cms
      .reorderHomepage(next.map((s, i) => ({ id: s.id, sortOrder: i })))
      .then(() => {
        toast.success("Order updated");
        void qc.invalidateQueries({ queryKey: ["admin", "cms", "homepage"] });
        void qc.invalidateQueries({ queryKey: ["cms", "home"] });
      })
      .catch(() => toast.error("Could not reorder"));
  };

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div>
      <PageHeader
        title="Homepage"
        description="Edit copy, CTAs, and visibility for each homepage section"
      />
      <div className="space-y-4">
        {data.map((section, i) => (
          <article key={section.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{section.title}</div>
                <div className="text-xs text-muted-foreground">{section.key}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={section.status ?? "PUBLISHED"} />
                <div className="flex items-center gap-2">
                  <Label htmlFor={`en-${section.id}`} className="text-xs">
                    Enabled
                  </Label>
                  <Switch
                    id={`en-${section.id}`}
                    checked={section.enabled !== false}
                    onCheckedChange={(enabled) =>
                      update.mutate({ id: section.id, payload: { enabled } })
                    }
                  />
                </div>
                <Button size="sm" variant="outline" onClick={() => move(i, -1)}>
                  Up
                </Button>
                <Button size="sm" variant="outline" onClick={() => move(i, 1)}>
                  Down
                </Button>
              </div>
            </div>
            <Textarea
              rows={8}
              defaultValue={JSON.stringify(section.payload ?? {}, null, 2)}
              onBlur={(e) => {
                try {
                  const payload = JSON.parse(e.target.value) as Record<string, unknown>;
                  update.mutate({ id: section.id, payload: { payload } });
                } catch {
                  toast.error("Invalid JSON");
                }
              }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
