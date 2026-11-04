import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { AdminCategory } from "@/lib/types";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api.admin.categories(),
  });

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminCategory | null>(null);

  const create = useMutation({
    mutationFn: () =>
      api.admin.createCategory({
        name: name.trim(),
        parentId: parentId || null,
      }),
    onSuccess: () => {
      toast.success("Category created");
      setName("");
      setParentId("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: () => toast.error("Could not create category"),
  });

  const update = useMutation({
    mutationFn: () =>
      api.admin.updateCategory(editing!.id, {
        name: editing!.name,
        parentId: editing!.parentId,
        archived: editing!.archived,
      }),
    onSuccess: () => {
      toast.success("Category updated");
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: () => toast.error("Could not update category"),
  });

  const remove = useMutation({
    mutationFn: () => api.admin.deleteCategory(deleteId!),
    onSuccess: () => {
      toast.success("Category deleted");
      setDeleteId(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: () => toast.error("Could not delete category"),
  });

  function flatten(nodes: AdminCategory[], depth = 0): Array<AdminCategory & { depth: number }> {
    const out: Array<AdminCategory & { depth: number }> = [];
    for (const n of nodes) {
      out.push({ ...n, depth });
      if (n.children?.length) out.push(...flatten(n.children, depth + 1));
    }
    return out;
  }

  const flat = flatten(data);

  return (
    <div>
      <PageHeader title="Categories" description="Organize your catalog" />

      <form
        className="mb-6 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) create.mutate();
        }}
      >
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">No parent</option>
          {flat.map((c) => (
            <option key={c.id} value={c.id}>
              {"— ".repeat(c.depth)}
              {c.name}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={create.isPending}>
          Add category
        </Button>
      </form>

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="space-y-2">
          {flat.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
          {flat.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3"
              style={{ marginLeft: c.depth * 16 }}
            >
              {editing?.id === c.id ? (
                <>
                  <Input
                    className="max-w-xs"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                  <Button size="sm" onClick={() => update.mutate()} disabled={update.isPending}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.productCount} products
                      {c.archived ? " · archived" : ""}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setDeleteId(c.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete category?"
        description="Products in this category will be unlinked."
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
