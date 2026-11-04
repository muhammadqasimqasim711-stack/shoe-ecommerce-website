import { createFileRoute } from "@tanstack/react-router";
import { CmsBlogForm } from "@/components/admin/cms-blog-form";

export const Route = createFileRoute("/admin/cms/blog/new")({
  component: () => <CmsBlogForm mode="create" />,
});
