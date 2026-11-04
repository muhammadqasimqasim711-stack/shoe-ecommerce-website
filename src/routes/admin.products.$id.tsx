import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/product-form";

export const Route = createFileRoute("/admin/products/$id")({
  component: AdminProductDetailPage,
});

function AdminProductDetailPage() {
  const { id } = Route.useParams();
  return <ProductForm mode="edit" productId={id} />;
}
