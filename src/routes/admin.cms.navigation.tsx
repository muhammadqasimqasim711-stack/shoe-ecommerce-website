import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/api";
import type { CmsNavItem, CmsNavMenu } from "@/lib/types";

export const Route = createFileRoute("/admin/cms/navigation")({
  component: CmsNavPage,
});

function CmsNavPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "cms", "nav"],
    queryFn: () => api.admin.cms.navigation(),
  });
  const [menus, setMenus] = useState<CmsNavMenu[]>([]);

  useEffect(() => {
    setMenus(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (menu: CmsNavMenu) => api.admin.cms.saveNavigation(menu.location, menu.items),
    onSuccess: () => {
      toast.success("Menu saved");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "nav"] });
      void qc.invalidateQueries({ queryKey: ["cms", "nav"] });
    },
    onError: () => toast.error("Could not save menu"),
  });

  const updateItem = (location: string, index: number, patch: Partial<CmsNavItem>) => {
    setMenus((prev) =>
      prev.map((m) =>
        m.location === location
          ? { ...m, items: m.items.map((it, i) => (i === index ? { ...it, ...patch } : it)) }
          : m,
      ),
    );
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <PageHeader
        title="Navigation"
        description="Header and footer menus shown on the storefront"
      />
      <div className="space-y-6">
        {menus.map((menu) => (
          <section
            key={menu.location}
            className="rounded-xl border border-border bg-background p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">
                {menu.name}{" "}
                <span className="text-xs font-normal text-muted-foreground">{menu.location}</span>
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setMenus((prev) =>
                      prev.map((m) =>
                        m.location === menu.location
                          ? {
                              ...m,
                              items: [
                                ...m.items,
                                {
                                  label: "New item",
                                  url: "/",
                                  sortOrder: m.items.length,
                                  enabled: true,
                                },
                              ],
                            }
                          : m,
                      ),
                    )
                  }
                >
                  Add item
                </Button>
                <Button size="sm" onClick={() => save.mutate(menu)} disabled={save.isPending}>
                  Save
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {menu.items.map((item, i) => (
                <div key={`${menu.location}-${i}`} className="grid gap-2 sm:grid-cols-4">
                  <Input
                    value={item.label}
                    onChange={(e) => updateItem(menu.location, i, { label: e.target.value })}
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => updateItem(menu.location, i, { url: e.target.value })}
                    className="sm:col-span-2"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => updateItem(menu.location, i, { enabled: e.target.checked })}
                    />
                    Enabled
                  </label>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
