import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/cms/banners")({
  component: CmsBannersPage,
});

function CmsBannersPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "cms", "banners"],
    queryFn: () => api.admin.cms.banners(),
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    desktopImageUrl: "",
    mobileImageUrl: "",
    buttonText: "Shop",
    buttonLink: "/shop",
    startsAt: "",
    endsAt: "",
    status: "DRAFT",
  });

  const create = useMutation({
    mutationFn: () =>
      api.admin.cms.createBanner({
        ...form,
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null,
      }),
    onSuccess: () => {
      toast.success("Banner created");
      setForm({ ...form, title: "", subtitle: "", desktopImageUrl: "" });
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "banners"] });
    },
    onError: () => toast.error("Could not create banner"),
  });
  const publish = useMutation({
    mutationFn: ({ id, on }: { id: string; on: boolean }) =>
      on ? api.admin.cms.publishBanner(id) : api.admin.cms.unpublishBanner(id),
    onSuccess: () => {
      toast.success("Banner updated");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "banners"] });
      void qc.invalidateQueries({ queryKey: ["cms", "banners"] });
    },
  });
  const remove = useMutation({
    mutationFn: () => api.admin.cms.deleteBanner(deleteId!),
    onSuccess: () => {
      toast.success("Banner deleted");
      setDeleteId(null);
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "banners"] });
    },
  });

  return (
    <div>
      <PageHeader title="Banners" description="Promotional banners on the storefront" />
      <form
        className="mb-8 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />
        <Input
          required
          placeholder="Desktop image URL"
          value={form.desktopImageUrl}
          onChange={(e) => setForm({ ...form, desktopImageUrl: e.target.value })}
        />
        <Input
          placeholder="Mobile image URL"
          value={form.mobileImageUrl}
          onChange={(e) => setForm({ ...form, mobileImageUrl: e.target.value })}
        />
        <Input
          placeholder="Button text"
          value={form.buttonText}
          onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
        />
        <Input
          placeholder="Button link"
          value={form.buttonLink}
          onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={form.startsAt}
          onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={form.endsAt}
          onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
        />
        <Button type="submit" disabled={create.isPending}>
          Add banner
        </Button>
      </form>
      <DataTable
        columns={["Title", "Status", "Link", "Actions"]}
        loading={isLoading}
        isEmpty={!data.length}
      >
        {data.map((b) => (
          <tr key={b.id} className="border-t border-border">
            <td className="p-3">{b.title || "—"}</td>
            <td className="p-3">
              <StatusBadge status={b.status} />
            </td>
            <td className="p-3 text-muted-foreground">{b.buttonLink}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => publish.mutate({ id: b.id, on: b.status !== "PUBLISHED" })}
                >
                  {b.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(b.id)}>
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete this banner?"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
