import { createFileRoute } from "@tanstack/react-router";
import { CmsBlogForm } from "@/components/admin/cms-blog-form";

export const Route = createFileRoute("/admin/cms/blog/$id")({
  component: EditBlog,
});

function EditBlog() {
  const { id } = Route.useParams();
  return <CmsBlogForm mode="edit" id={id} />;
}
