import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { api } from "@/lib/api";

type ImageRow = {
  id?: string;
  url: string;
  altText?: string;
  isMain?: boolean;
  sortOrder?: number;
};
type VariantRow = {
  id?: string;
  size: string;
  color: string;
  material: string;
  sku: string;
  price: string;
  stock: string;
  _delete?: boolean;
};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
};

const emptyVariant = (): VariantRow => ({
  size: "",
  color: "",
  material: "",
  sku: "",
  price: "",
  stock: "0",
});

export function ProductForm({ mode, productId }: ProductFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit" && !!productId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => api.admin.product(productId!),
    enabled: isEdit,
  });
  const { data: brands = [] } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: () => api.admin.brands(),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api.admin.categories(),
  });

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [brandId, setBrandId] = useState("");
  const [gender, setGender] = useState("");
  const [collection, setCollection] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [images, setImages] = useState<ImageRow[]>([{ url: "", isMain: true }]);
  const [variants, setVariants] = useState<VariantRow[]>([emptyVariant()]);
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [archiveOpen, setArchiveOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    setName(String(data.name ?? ""));
    setSku(String(data.sku ?? ""));
    setDescription(String(data.description ?? ""));
    setPrice(String(data.price ?? "0"));
    setCompareAtPrice(data.compareAtPrice != null ? String(data.compareAtPrice) : "");
    setCostPrice(data.costPrice != null ? String(data.costPrice) : "");
    setBrandId(String(data.brandId ?? ""));
    setGender(String(data.gender ?? ""));
    setCollection(String(data.collection ?? ""));
    setCategoryIds((data.categoryIds as string[]) ?? []);
    setIsFeatured(Boolean(data.isFeatured));
    setStatus(String(data.status ?? "DRAFT"));
    const imgs = (data.images as ImageRow[]) ?? [];
    setImages(
      imgs.length
        ? imgs.map((img, i) => ({
            id: img.id,
            url: img.url,
            altText: img.altText,
            isMain: img.isMain ?? i === 0,
            sortOrder: img.sortOrder ?? i,
          }))
        : [{ url: "", isMain: true }],
    );
    const vars = (data.variants as Array<Record<string, unknown>>) ?? [];
    setVariants(
      vars.length
        ? vars.map((v) => ({
            id: String(v.id),
            size: String(v.size ?? ""),
            color: String(v.color ?? ""),
            material: String(v.material ?? ""),
            sku: String(v.sku ?? ""),
            price: v.price != null ? String(v.price) : "",
            stock: String(v.stock ?? 0),
          }))
        : [emptyVariant()],
    );
    setLowStockThreshold(String(data.lowStockThreshold ?? 5));
    setWeight(data.weight != null ? String(data.weight) : "");
    setLength(data.length != null ? String(data.length) : "");
    setWidth(data.width != null ? String(data.width) : "");
    setHeight(data.height != null ? String(data.height) : "");
    setSeoTitle(String(data.seoTitle ?? ""));
    setSeoDescription(String(data.seoDescription ?? ""));
  }, [data]);

  function buildPayload(publishStatus?: string) {
    const nextStatus = publishStatus ?? status;
    const cleanImages = images
      .filter((img) => img.url.trim())
      .map((img, i) => ({
        id: img.id,
        url: img.url.trim(),
        altText: img.altText,
        isMain: img.isMain ?? i === 0,
        sortOrder: i,
      }));
    return {
      name: name.trim(),
      sku: sku.trim() || undefined,
      description,
      price: Number(price) || 0,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      costPrice: costPrice ? Number(costPrice) : null,
      brandId: brandId || null,
      gender: gender || undefined,
      collection: collection || null,
      categoryIds,
      isFeatured,
      status: nextStatus,
      isPublished: nextStatus === "ACTIVE",
      images: cleanImages,
      imageUrl: cleanImages[0]?.url,
      variants: variants
        .filter((v) => !v._delete)
        .map((v) => ({
          id: v.id,
          size: v.size || undefined,
          color: v.color || undefined,
          material: v.material || undefined,
          sku: v.sku || undefined,
          price: v.price ? Number(v.price) : undefined,
          stock: Number(v.stock) || 0,
        })),
      lowStockThreshold: Number(lowStockThreshold) || 0,
      weight: weight ? Number(weight) : null,
      length: length ? Number(length) : null,
      width: width ? Number(width) : null,
      height: height ? Number(height) : null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    };
  }

  const save = useMutation({
    mutationFn: async (publishStatus?: string) => {
      const payload = buildPayload(publishStatus);
      if (isEdit) return api.admin.updateProduct(productId!, payload);
      return api.admin.createProduct(payload);
    },
    onSuccess: (product, publishStatus) => {
      toast.success(publishStatus === "ACTIVE" ? "Product published" : "Product saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      if (isEdit) {
        void queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
      } else {
        const id = String((product as { id?: string }).id ?? "");
        if (id) void navigate({ to: "/admin/products/$id", params: { id } });
        else void navigate({ to: "/admin/products" });
      }
    },
    onError: () => toast.error("Could not save product"),
  });

  const archive = useMutation({
    mutationFn: () => api.admin.archiveProduct(productId!),
    onSuccess: () => {
      toast.success("Product archived");
      setArchiveOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
    },
    onError: () => toast.error("Could not archive product"),
  });

  function flatCategories(
    nodes: Array<{ id: string; name: string; children?: unknown[] }>,
    depth = 0,
  ): Array<{ id: string; name: string }> {
    const out: Array<{ id: string; name: string }> = [];
    for (const n of nodes) {
      out.push({ id: n.id, name: `${"— ".repeat(depth)}${n.name}` });
      if (Array.isArray(n.children) && n.children.length) {
        out.push(...flatCategories(n.children as typeof nodes, depth + 1));
      }
    }
    return out;
  }

  if (isEdit && isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isEdit && (isError || !data)) return <p className="text-amber-600">Product not found.</p>;

  const categoryOptions = flatCategories(
    categories as Array<{ id: string; name: string; children?: unknown[] }>,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title={isEdit ? "Edit product" : "Add product"}
        backTo="/admin/products"
        backLabel="Products"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={save.isPending}
              onClick={() => save.mutate("DRAFT")}
            >
              Save draft
            </Button>
            <Button type="button" disabled={save.isPending} onClick={() => save.mutate("ACTIVE")}>
              Publish
            </Button>
            {isEdit && status !== "ARCHIVED" && (
              <Button type="button" variant="destructive" onClick={() => setArchiveOpen(true)}>
                Archive
              </Button>
            )}
          </div>
        }
      />

      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <h2 className="font-semibold">Basic info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Brand</Label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">No brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Any</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Collection</Label>
            <Input value={collection} onChange={(e) => setCollection(e.target.value)} />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Categories</Label>
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-md border border-input p-3">
              {categoryOptions.length === 0 && (
                <span className="text-sm text-muted-foreground">No categories yet</span>
              )}
              {categoryOptions.map((c) => {
                const checked = categoryIds.includes(c.id);
                return (
                  <label key={c.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setCategoryIds((prev) =>
                          checked ? prev.filter((id) => id !== c.id) : [...prev, c.id],
                        )
                      }
                    />
                    {c.name}
                  </label>
                );
              })}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            Featured
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <h2 className="font-semibold">Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Compare at</Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Cost</Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Images</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setImages((prev) => [...prev, { url: "", isMain: false }])}
          >
            <Plus className="mr-1 h-4 w-4" /> Add URL
          </Button>
        </div>
        <div className="space-y-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Input
                className="min-w-[200px] flex-1"
                placeholder="https://…"
                value={img.url}
                onChange={(e) =>
                  setImages((prev) =>
                    prev.map((row, i) => (i === index ? { ...row, url: e.target.value } : row)),
                  )
                }
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="main-image"
                  checked={!!img.isMain}
                  onChange={() =>
                    setImages((prev) => prev.map((row, i) => ({ ...row, isMain: i === index })))
                  }
                />
                Main
              </label>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={index === 0}
                onClick={() =>
                  setImages((prev) => {
                    const next = [...prev];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    return next;
                  })
                }
              >
                ↑
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Variants</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setVariants((p) => [...p, emptyVariant()])}
          >
            <Plus className="mr-1 h-4 w-4" /> Add variant
          </Button>
        </div>
        <div className="space-y-3">
          {variants.map((v, index) => (
            <div
              key={v.id ?? index}
              className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-6"
            >
              <Input
                placeholder="Size"
                value={v.size}
                onChange={(e) =>
                  setVariants((p) =>
                    p.map((row, i) => (i === index ? { ...row, size: e.target.value } : row)),
                  )
                }
              />
              <Input
                placeholder="Color"
                value={v.color}
                onChange={(e) =>
                  setVariants((p) =>
                    p.map((row, i) => (i === index ? { ...row, color: e.target.value } : row)),
                  )
                }
              />
              <Input
                placeholder="Material"
                value={v.material}
                onChange={(e) =>
                  setVariants((p) =>
                    p.map((row, i) => (i === index ? { ...row, material: e.target.value } : row)),
                  )
                }
              />
              <Input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) =>
                  setVariants((p) =>
                    p.map((row, i) => (i === index ? { ...row, sku: e.target.value } : row)),
                  )
                }
              />
              <Input
                placeholder="Price"
                type="number"
                step="0.01"
                value={v.price}
                onChange={(e) =>
                  setVariants((p) =>
                    p.map((row, i) => (i === index ? { ...row, price: e.target.value } : row)),
                  )
                }
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Stock"
                  type="number"
                  min={0}
                  value={v.stock}
                  onChange={(e) =>
                    setVariants((p) =>
                      p.map((row, i) => (i === index ? { ...row, stock: e.target.value } : row)),
                    )
                  }
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setVariants((p) => p.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-xs space-y-2">
          <Label>Low stock threshold</Label>
          <Input
            type="number"
            min={0}
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <h2 className="font-semibold">Shipping dimensions</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label>Weight</Label>
            <Input
              type="number"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Length</Label>
            <Input
              type="number"
              step="0.01"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Width</Label>
            <Input
              type="number"
              step="0.01"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              type="number"
              step="0.01"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <h2 className="font-semibold">SEO</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>SEO title</Label>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>SEO description</Label>
            <Textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive this product?"
        description="It will be hidden from the storefront but can be restored later."
        confirmLabel="Archive"
        destructive
        loading={archive.isPending}
        onConfirm={() => archive.mutate()}
      />
    </div>
  );
}
