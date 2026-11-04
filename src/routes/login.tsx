import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

import { z } from "zod";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Sign In — SOLE" },
      { name: "description", content: "Sign in to your SOLE account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const destination = search?.redirect && search.redirect.startsWith("/") ? search.redirect : "/";

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: destination as never, replace: true });
    }
  }, [isAuthenticated, destination, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email: email.trim(), password });
      toast.success("Signed in");
      void navigate({ to: destination as never, replace: true });
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 401
          ? "Invalid email or password"
          : "Could not sign in. Is the backend running?";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader showSearch={false} />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-4xl font-black tracking-tighter mb-2">Sign in</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Welcome back. New here?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Create an account
          </Link>
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
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
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-full px-5"
          />
          <Button type="submit" className="w-full rounded-full h-11" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </main>
    </div>
  );
}
