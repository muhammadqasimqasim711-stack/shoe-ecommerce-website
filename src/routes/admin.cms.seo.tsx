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

export const Route = createFileRoute("/admin/cms/seo")({
  component: CmsSeoPage,
});

function CmsSeoPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "cms", "settings"],
    queryFn: () => api.admin.cms.settings(),
  });
  const [form, setForm] = useState({
    defaultSeoTitle: "",
    defaultSeoDescription: "",
    defaultOgImage: "",
  });
  useEffect(() => {
    if (!data) return;
    setForm({
      defaultSeoTitle: data.defaultSeoTitle ?? "",
      defaultSeoDescription: data.defaultSeoDescription ?? "",
      defaultOgImage: data.defaultOgImage ?? "",
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () => api.admin.cms.updateSettings(form),
    onSuccess: () => {
      toast.success("SEO defaults saved");
      void qc.invalidateQueries({ queryKey: ["admin", "cms", "settings"] });
      void qc.invalidateQueries({ queryKey: ["cms", "settings"] });
    },
    onError: () => toast.error("Could not save SEO"),
  });

  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <PageHeader
        title="SEO"
        description="Default meta tags for the storefront. Pages and blog posts can override these."
        actions={<Button type="submit">Save</Button>}
      />
      <div>
        <Label>Default title</Label>
        <Input
          value={form.defaultSeoTitle}
          onChange={(e) => setForm({ ...form, defaultSeoTitle: e.target.value })}
        />
      </div>
      <div>
        <Label>Default description</Label>
        <Textarea
          rows={4}
          value={form.defaultSeoDescription}
          onChange={(e) => setForm({ ...form, defaultSeoDescription: e.target.value })}
        />
      </div>
      <div>
        <Label>Default Open Graph image URL</Label>
        <Input
          value={form.defaultOgImage}
          onChange={(e) => setForm({ ...form, defaultOgImage: e.target.value })}
        />
      </div>
    </form>
  );
}
