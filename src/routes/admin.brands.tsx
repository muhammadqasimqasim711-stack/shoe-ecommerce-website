import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/brands")({
  component: AdminBrandsPage,
});

function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: () => api.admin.brands(),
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const create = useMutation({
    mutationFn: () =>
      api.admin.createBrand({ name: name.trim(), description: description.trim() || undefined }),
    onSuccess: () => {
      toast.success("Brand created");
      setName("");
      setDescription("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
    },
    onError: () => toast.error("Could not create brand (name may already exist)"),
  });

  const update = useMutation({
    mutationFn: ({ id, description: desc }: { id: string; description: string }) =>
      api.admin.updateBrand(id, { description: desc }),
    onSuccess: () => {
      toast.success("Brand updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
    },
    onError: () => toast.error("Could not update brand"),
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black tracking-tight">Brands</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate();
        }}
        className="flex flex-wrap gap-3 rounded-xl border border-border bg-background p-4"
      >
        <Input
          placeholder="Brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-xs"
          required
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" disabled={create.isPending} className="rounded-full">
          Add brand
        </Button>
      </form>

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border bg-background overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Products</th>
                <th className="p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b.id} className="border-b border-border/60">
                  <td className="p-3 font-medium">{b.name}</td>
                  <td className="p-3">{b.productCount}</td>
                  <td className="p-3">
                    <Input
                      defaultValue={b.description ?? ""}
                      className="max-w-md"
                      onBlur={(e) => {
                        const next = e.target.value;
                        if (next !== (b.description ?? "")) {
                          update.mutate({ id: b.id, description: next });
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
