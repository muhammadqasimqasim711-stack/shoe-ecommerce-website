import { createFileRoute } from "@tanstack/react-router";
import { CmsPageForm } from "@/components/admin/cms-page-form";

export const Route = createFileRoute("/admin/cms/pages/new")({
  component: () => <CmsPageForm mode="create" />,
});
