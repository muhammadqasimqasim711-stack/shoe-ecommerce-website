import { createFileRoute } from "@tanstack/react-router";
import { CmsPageForm } from "@/components/admin/cms-page-form";

export const Route = createFileRoute("/admin/cms/pages/$id")({
  component: CmsPageEdit,
});

function CmsPageEdit() {
  const { id } = Route.useParams();
  return <CmsPageForm mode="edit" id={id} />;
}
