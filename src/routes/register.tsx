import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — SOLE" },
      { name: "description", content: "Create your SOLE account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync({
        email: email.trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      toast.success("Account created");
      void navigate({ to: "/", replace: true });
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 409
          ? "Email already registered"
          : "Could not create account. Is the backend running?";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader showSearch={false} />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-4xl font-black tracking-tighter mb-2">Create account</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 rounded-full px-5"
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 rounded-full px-5"
            />
          </div>
          <Input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-full px-5"
          />
          <Input
            type="password"
            required
            minLength={8}
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-full px-5"
          />
          <Button type="submit" className="w-full rounded-full h-11" disabled={register.isPending}>
            {register.isPending ? "Creating…" : "Create account"}
          </Button>
        </form>
      </main>
    </div>
  );
}
