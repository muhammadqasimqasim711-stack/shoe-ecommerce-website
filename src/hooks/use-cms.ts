import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCmsHome() {
  return useQuery({
    queryKey: ["cms", "home"],
    queryFn: () => api.getCmsHome(),
    staleTime: 60_000,
  });
}

export function useCmsBanners() {
  return useQuery({
    queryKey: ["cms", "banners"],
    queryFn: () => api.getCmsBanners(),
    staleTime: 60_000,
  });
}

export function useCmsNav() {
  return useQuery({
    queryKey: ["cms", "nav"],
    queryFn: () => api.getCmsNav(),
    staleTime: 60_000,
  });
}

export function useCmsSettings() {
  return useQuery({
    queryKey: ["cms", "settings"],
    queryFn: () => api.getCmsSettings(),
    staleTime: 60_000,
  });
}

export function sectionPayload(
  sections: Array<{ key: string; payload: Record<string, unknown> }> | undefined,
  key: string,
) {
  return sections?.find((s) => s.key === key)?.payload ?? {};
}

export function str(payload: Record<string, unknown>, key: string, fallback = "") {
  const v = payload[key];
  return typeof v === "string" && v.trim() ? v : fallback;
}
