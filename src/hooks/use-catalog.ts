import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getCartId, setCartId, clearCartId } from "@/lib/cart-storage";
import { getWishlistId, setWishlistId } from "@/lib/wishlist-storage";
import type { HomeCatalog, ProductCard } from "@/lib/types";

export function useHomeCatalog() {
  return useQuery({
    queryKey: ["catalog", "home"],
    queryFn: () => api.getHomeCatalog(),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useProductSearch(search: string) {
  return useQuery({
    queryKey: ["products", "search", search],
    queryFn: () => api.getProducts({ search, limit: 100 }),
    enabled: search.trim().length >= 2,
    staleTime: 30_000,
  });
}

export type ShopFilters = {
  gender?: string;
  onSale?: string;
  sort?: string;
  days?: string;
  brand?: string;
  category?: string;
  search?: string;
  collection?: string;
};

export function useShopProducts(filters: ShopFilters) {
  const params: Record<string, string | number | boolean | undefined> = {
    limit: 100,
  };
  if (filters.gender) params.gender = filters.gender;
  if (filters.onSale === "true") params.onSale = true;
  if (filters.sort) params.sort = filters.sort;
  if (filters.days) params.days = Number(filters.days);
  if (filters.brand) params.brand = filters.brand;
  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;
  if (filters.collection) params.collection = filters.collection;

  return useQuery({
    queryKey: ["products", "shop", filters],
    queryFn: () => api.getProducts(params),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => api.getBrands(),
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
    staleTime: 60_000,
  });
}

export function useCart() {
  const queryClient = useQueryClient();
  const [cartId, setCartIdState] = useState<string | null>(null);

  useEffect(() => {
    setCartIdState(getCartId());
  }, []);

  const cartQuery = useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => api.getCart(cartId!),
    enabled: Boolean(cartId),
    staleTime: 10_000,
  });

  const ensureCart = async () => {
    let id = cartId ?? getCartId();
    if (!id) {
      const created = await api.createCart();
      id = created.id;
      setCartId(id);
      setCartIdState(id);
    }
    return id;
  };

  const addItem = useMutation({
    mutationFn: async (variantId: string) => {
      const id = await ensureCart();
      return api.addCartItem(id, variantId);
    },
    onSuccess: (cart) => {
      setCartId(cart.id);
      setCartIdState(cart.id);
      queryClient.setQueryData(["cart", cart.id], cart);
    },
  });

  const syncCart = (cart: Awaited<ReturnType<typeof api.getCart>>) => {
    setCartId(cart.id);
    setCartIdState(cart.id);
    queryClient.setQueryData(["cart", cart.id], cart);
  };

  const updateItem = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const id = await ensureCart();
      return api.updateCartItem(id, itemId, quantity);
    },
    onSuccess: syncCart,
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const id = await ensureCart();
      return api.removeCartItem(id, itemId);
    },
    onSuccess: syncCart,
  });

  const applyCoupon = useMutation({
    mutationFn: async (code: string) => {
      const id = await ensureCart();
      return api.applyCartCoupon(id, code);
    },
    onSuccess: syncCart,
  });

  const removeCoupon = useMutation({
    mutationFn: async () => {
      const id = await ensureCart();
      return api.removeCartCoupon(id);
    },
    onSuccess: syncCart,
  });

  const clearLocalCart = () => {
    clearCartId();
    setCartIdState(null);
    queryClient.removeQueries({ queryKey: ["cart"] });
  };

  const cart =
    cartQuery.data ??
    addItem.data ??
    updateItem.data ??
    removeItem.data ??
    applyCoupon.data ??
    removeCoupon.data;

  return {
    cart,
    cartId: cartId ?? getCartId(),
    itemCount: cart?.itemCount ?? 0,
    isLoading: cartQuery.isLoading,
    addItem,
    updateItem,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearLocalCart,
    refetch: cartQuery.refetch,
  };
}

export function useWishlist() {
  const queryClient = useQueryClient();
  const [wishlistId, setWishlistIdState] = useState<string | null>(null);

  useEffect(() => {
    setWishlistIdState(getWishlistId());
  }, []);

  const wishlistQuery = useQuery({
    queryKey: ["wishlist", wishlistId],
    queryFn: () => api.getWishlist(wishlistId!),
    enabled: Boolean(wishlistId),
    staleTime: 10_000,
  });

  const syncWishlist = (wishlist: Awaited<ReturnType<typeof api.getWishlist>>) => {
    setWishlistId(wishlist.id);
    setWishlistIdState(wishlist.id);
    queryClient.setQueryData(["wishlist", wishlist.id], wishlist);
  };

  const ensureWishlist = async () => {
    let id = wishlistId ?? getWishlistId();
    if (!id) {
      const created = await api.createWishlist();
      id = created.id;
      setWishlistId(id);
      setWishlistIdState(id);
    }
    return id;
  };

  const addItem = useMutation({
    mutationFn: async (variantId: string) => {
      const id = await ensureWishlist();
      return api.addWishlistItem(id, variantId);
    },
    onSuccess: syncWishlist,
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const id = await ensureWishlist();
      return api.removeWishlistItem(id, itemId);
    },
    onSuccess: syncWishlist,
  });

  const removeVariant = useMutation({
    mutationFn: async (variantId: string) => {
      const id = await ensureWishlist();
      return api.removeWishlistVariant(id, variantId);
    },
    onSuccess: syncWishlist,
  });

  const toggleItem = useMutation({
    mutationFn: async (variantId: string) => {
      const id = await ensureWishlist();
      const current =
        queryClient.getQueryData<Awaited<ReturnType<typeof api.getWishlist>>>(["wishlist", id]) ??
        (await api.getWishlist(id).catch(() => null));

      const existing = current?.items.find((item) => item.variantId === variantId);
      if (existing) {
        return api.removeWishlistItem(id, existing.id);
      }
      return api.addWishlistItem(id, variantId);
    },
    onSuccess: syncWishlist,
  });

  const wishlist =
    wishlistQuery.data ?? addItem.data ?? removeItem.data ?? removeVariant.data ?? toggleItem.data;
  const productIds = new Set(wishlist?.items.map((item) => item.product.id) ?? []);
  const variantIds = new Set(wishlist?.items.map((item) => item.variantId) ?? []);

  return {
    wishlist,
    items: wishlist?.items ?? [],
    itemCount: wishlist?.itemCount ?? 0,
    isLoading: wishlistQuery.isLoading,
    isSaved: (productOrVariantId: string) =>
      productIds.has(productOrVariantId) || variantIds.has(productOrVariantId),
    addItem,
    removeItem,
    removeVariant,
    toggleItem,
  };
}

export function pickDisplayProducts(
  catalog: HomeCatalog | undefined,
  filter: string,
): ProductCard[] {
  if (!catalog) return [];
  if (filter === "All") return catalog.products;

  const gender = filter.toLowerCase();
  return catalog.products.filter((p) => {
    if (!p.gender) return false;
    if (gender === "kids") return p.gender === "kids";
    return p.gender === gender || p.gender === "unisex";
  });
}
