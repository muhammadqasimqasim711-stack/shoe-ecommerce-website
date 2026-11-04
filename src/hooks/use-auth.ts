import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  clearAuth,
  getAuthToken,
  getStoredUser,
  setAuthToken,
  setStoredUser,
} from "@/lib/auth-storage";
import type { AuthResponse, AuthUser } from "@/lib/types";

function persistAuth(res: AuthResponse) {
  setAuthToken(res.accessToken);
  setStoredUser(res.user);
}

function toAuthUser(profile: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: { name: string } | string;
}): AuthUser {
  const role = typeof profile.role === "string" ? profile.role : (profile.role?.name ?? "CUSTOMER");
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    role,
  };
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(null);
  const [cachedUser, setCachedUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      setTokenState(getAuthToken());
      setCachedUser(getStoredUser());
    };
    syncAuth();

    if (typeof window !== "undefined") {
      window.addEventListener("sole_token_changed", syncAuth);
      window.addEventListener("storage", syncAuth);
      return () => {
        window.removeEventListener("sole_token_changed", syncAuth);
        window.removeEventListener("storage", syncAuth);
      };
    }
  }, []);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const profile = await api.me();
        const user = toAuthUser(profile);
        setStoredUser(user);
        setCachedUser(user);
        return user;
      } catch (err) {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          clearAuth();
          setTokenState(null);
          setCachedUser(null);
          queryClient.removeQueries({ queryKey: ["auth"] });
        }
        throw err;
      }
    },
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: false,
  });

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (res) => {
      persistAuth(res);
      setTokenState(res.accessToken);
      setCachedUser(res.user);
      queryClient.setQueryData(["auth", "me"], res.user);
    },
  });

  const register = useMutation({
    mutationFn: (payload: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => api.register(payload),
    onSuccess: (res) => {
      persistAuth(res);
      setTokenState(res.accessToken);
      setCachedUser(res.user);
      queryClient.setQueryData(["auth", "me"], res.user);
    },
  });

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setCachedUser(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
  };

  const user = meQuery.data ?? cachedUser;

  return {
    user,
    isAuthenticated: Boolean(token && user),
    isLoading: Boolean(token) && meQuery.isLoading,
    login,
    register,
    logout,
  };
}
