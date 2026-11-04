import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable } from "@/components/admin/data-table";
import { api } from "@/lib/api";
import { STAFF_ROLES } from "@/lib/staff";
import type { AdminUser } from "@/lib/types";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.admin.users(),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("ADMIN");

  function openCreate() {
    setEditing(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setRole("ADMIN");
    setOpen(true);
  }

  function openEdit(u: AdminUser) {
    setEditing(u);
    setEmail(u.email);
    setPassword("");
    setFirstName(u.firstName ?? "");
    setLastName(u.lastName ?? "");
    setRole(u.role);
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: () => {
      if (editing) {
        return api.admin.updateUser(editing.id, {
          firstName: firstName || null,
          lastName: lastName || null,
          role,
          ...(password ? { password } : {}),
        });
      }
      return api.admin.createUser({
        email: email.trim(),
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        role,
      });
    },
    onSuccess: () => {
      toast.success(editing ? "User updated" : "User created");
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => toast.error("Could not save user"),
  });

  const toggle = useMutation({
    mutationFn: ({ id, disabled }: { id: string; disabled: boolean }) =>
      api.admin.updateUser(id, { disabled }),
    onSuccess: () => {
      toast.success("User updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => toast.error("Could not update user"),
  });

  return (
    <div>
      <PageHeader
        title="Admin users"
        description="Staff accounts and roles"
        actions={<Button onClick={openCreate}>Add user</Button>}
      />

      <DataTable
        columns={["User", "Role", "Status", "Joined", ""]}
        loading={isLoading}
        isEmpty={data.length === 0}
      >
        {data.map((u) => (
          <tr key={u.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="p-3">
              <div className="font-medium">
                {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email}
              </div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </td>
            <td className="p-3 text-sm">{u.role.replaceAll("_", " ")}</td>
            <td className="p-3">
              <StatusBadge status={u.disabled ? "disabled" : "active"} />
            </td>
            <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggle.mutate({ id: u.id, disabled: !u.disabled })}
                >
                  {u.disabled ? "Enable" : "Disable"}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit staff user" : "Add staff user"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {!editing && (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{editing ? "New password (optional)" : "Password"}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={editing ? undefined : 8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={(!editing && (!email.trim() || password.length < 8)) || save.isPending}
              onClick={() => save.mutate()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
