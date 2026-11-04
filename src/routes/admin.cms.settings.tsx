import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/cms/settings")({
  component: CmsSettingsPage,
});

function CmsSettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "cms", "settings"],
    queryFn: () => api.admin.cms.settings(),
  });
  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: () => api.admin.cms.updateSettings(form),
    onSuccess: () => {
      toast.success("CMS settings saved");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "settings"] });
      void qc.invalidateQueries({ queryKey: ["cms", "settings"] });
    },
    onError: () => toast.error("Could not save settings"),
  });

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <PageHeader
        title="CMS settings"
        description="Logo, contact, social, and newsletter copy. Store currency stays in CRM Settings."
        actions={<Button type="submit">Save</Button>}
      />
      {[
        ["storeName", "Website name"],
        ["logoUrl", "Logo URL"],
        ["faviconUrl", "Favicon URL"],
        ["contactEmail", "Contact email"],
        ["contactPhone", "Contact phone"],
        ["contactAddress", "Contact address"],
      ].map(([key, label]) => (
        <div key={key}>
          <Label>{label}</Label>
          <Input value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)} />
        </div>
      ))}
      <div>
        <Label>Footer text</Label>
        <Textarea
          rows={3}
          value={form.footerText ?? ""}
          onChange={(e) => set("footerText", e.target.value)}
        />
      </div>
      <div>
        <Label>Newsletter heading</Label>
        <Input
          value={form.newsletterHeading ?? ""}
          onChange={(e) => set("newsletterHeading", e.target.value)}
        />
      </div>
      <div>
        <Label>Newsletter subtext</Label>
        <Textarea
          rows={2}
          value={form.newsletterSubtext ?? ""}
          onChange={(e) => set("newsletterSubtext", e.target.value)}
        />
      </div>
      <div>
        <Label>Social links JSON</Label>
        <Textarea
          rows={5}
          value={form.socialLinksJson ?? ""}
          onChange={(e) => set("socialLinksJson", e.target.value)}
        />
      </div>
    </form>
  );
}
