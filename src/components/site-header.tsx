import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useCart, useWishlist } from "@/hooks/use-catalog";
import { useFlyCart } from "@/context/fly-cart-context";
import { useLocale } from "@/hooks/use-locale";
import type { MessageKey } from "@/lib/locale";
import { isStaffRole } from "@/lib/staff";
import { useCmsNav, useCmsSettings } from "@/hooks/use-cms";

const NAV_LINKS: Array<{
  labelKey: MessageKey;
  to: "/" | "/shop" | "/brands" | "/wishlist";
  search?: Record<string, string>;
}> = [
  { labelKey: "new", to: "/shop", search: { sort: "newest", days: "30" } },
  { labelKey: "men", to: "/shop", search: { gender: "men" } },
  { labelKey: "women", to: "/shop", search: { gender: "women" } },
  { labelKey: "kids", to: "/shop", search: { gender: "kids" } },
  { labelKey: "sale", to: "/shop", search: { onSale: "true" } },
  { labelKey: "brands", to: "/brands" },
];

type SiteHeaderProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
};

export function SiteHeader({ search = "", onSearchChange, showSearch = true }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isCartBouncing, plusOneBadges } = useFlyCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLocale();
  const { data: cmsNav } = useCmsNav();
  const { data: cmsSettings } = useCmsSettings();
  const headerLinks = cmsNav?.header?.length
    ? cmsNav.header
    : NAV_LINKS.map((n) => ({
        label: t(n.labelKey),
        url: n.search ? `${n.to}?${new URLSearchParams(n.search).toString()}` : n.to,
      }));
  const storeName = (typeof cmsSettings?.storeName === "string" && cmsSettings.storeName) || "SOLE";
  const logoUrl = typeof cmsSettings?.logoUrl === "string" ? cmsSettings.logoUrl : "";

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const value = onSearchChange ? search : localSearch;

  const setValue = (next: string) => {
    if (onSearchChange) onSearchChange(next);
    else setLocalSearch(next);
  };

  const goToSearch = (raw: string) => {
    const q = raw.trim();
    if (q.length < 1) return;
    setMenuOpen(false);
    void navigate({ to: "/shop", search: { search: q } });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearch(value);
    }
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    toast.success("Signed out");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link
            to="/"
            className="font-display text-2xl font-black tracking-tighter flex items-center gap-2"
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-8 max-w-[140px] object-contain" />
            ) : (
              <>
                {storeName}
                <span className="text-accent">.</span>
              </>
            )}
          </Link>
          <nav className="hidden lg:flex gap-7 text-sm font-medium">
            {headerLinks.map((n) => (
              <a
                key={`${n.label}-${n.url}`}
                href={n.url}
                className="relative py-1 transition hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all hover:after:w-full"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="hidden md:flex items-center gap-2 rounded-full bg-muted px-4 py-2 w-64">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                id="desktop-product-search"
                name="desktopProductSearch"
                type="search"
                autoComplete="off"
                placeholder={t("searchPlaceholder")}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="bg-transparent text-sm outline-none flex-1"
                aria-label="Search products"
              />
            </div>
          )}
          <div className="hidden sm:block">
            <LocaleSwitcher variant="header" />
          </div>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/wishlist" aria-label={t("wishlist")}>
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground grid place-items-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                onClick={() => setAccountOpen((o) => !o)}
              >
                <User className="h-5 w-5 text-accent" />
              </Button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-lg p-3 z-50">
                  <p className="text-xs text-muted-foreground truncate mb-2">{user?.email}</p>
                  {isStaffRole(user?.role) && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="flex w-full items-center gap-2 text-sm font-medium py-2 hover:text-accent"
                    >
                      {t("adminCrm")}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 text-sm font-medium py-2 hover:text-accent"
                  >
                    <LogOut className="h-4 w-4" /> {t("logOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/login" aria-label={t("signIn")}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={`relative transition-transform ${isCartBouncing ? "animate-cart-bounce text-accent" : ""}`}
            data-cart-target
          >
            <Link to="/cart" aria-label={t("cart")}>
              <ShoppingBag className={`h-5 w-5 ${isCartBouncing ? "text-accent" : ""}`} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground grid place-items-center">
                  {itemCount}
                </span>
              )}
              {plusOneBadges.map((badge) => (
                <span
                  key={badge.id}
                  className="animate-plus-one absolute left-1/2 top-0 pointer-events-none rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-extrabold text-accent-foreground shadow-lg border border-white/20"
                >
                  +1
                </span>
              ))}
            </Link>
          </Button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden border-t border-border px-4 py-3 flex flex-col gap-3">
          {showSearch && (
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                id="mobile-product-search"
                name="mobileProductSearch"
                type="search"
                autoComplete="off"
                placeholder={t("searchPlaceholder")}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="bg-transparent text-sm outline-none flex-1"
                aria-label="Search products"
              />
            </div>
          )}
          <LocaleSwitcher variant="header" />
          <nav className="flex flex-col gap-3">
            {headerLinks.map((n) => (
              <a
                key={`${n.label}-${n.url}`}
                href={n.url}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-1"
              >
                {n.label}
              </a>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-1"
            >
              {t("wishlist")}
              {wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-1"
            >
              {t("cart")}
              {itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                className="text-sm font-medium py-1 text-left"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                {t("logOut")} ({user?.email})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium py-1"
                >
                  {t("signIn")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium py-1"
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
