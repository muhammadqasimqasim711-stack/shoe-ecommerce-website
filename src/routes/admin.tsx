import { Link, Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Plus,
  Tags,
  Warehouse,
  Star,
  ShoppingBag,
  RotateCcw,
  Banknote,
  Users,
  Filter,
  Ticket,
  CreditCard,
  Truck,
  BarChart3,
  Shield,
  KeyRound,
  ScrollText,
  Bell,
  Settings,
  Store,
  MessageSquare,
  Mail,
  Image,
  FileText,
  Newspaper,
  Images,
  Menu,
  Search,
} from "lucide-react";
import { getAuthToken, getStoredUser } from "@/lib/auth-storage";
import { isStaffRole } from "@/lib/staff";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  search?: Record<string, string>;
  match?: (pathname: string, search: string) => boolean;
};

type NavGroup = {
  label?: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/products/new", label: "Add Product", icon: Plus },
      { to: "/admin/categories", label: "Categories", icon: Tags },
      { to: "/admin/inventory", label: "Inventory", icon: Warehouse },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Orders",
    items: [
      {
        to: "/admin/orders",
        label: "All Orders",
        icon: ShoppingBag,
        match: (p, s) => p.startsWith("/admin/orders") && !s.includes("status=Shipped"),
      },
      { to: "/admin/returns", label: "Returns", icon: RotateCcw },
      { to: "/admin/refunds", label: "Refunds", icon: Banknote },
    ],
  },
  {
    label: "CRM",
    items: [
      { to: "/admin/crm", label: "CRM Overview", icon: LayoutDashboard, exact: true },
      { to: "/admin/customers", label: "Customers", icon: Users },
      { to: "/admin/segments", label: "Segments", icon: Filter },
    ],
  },
  {
    label: "Marketing",
    items: [{ to: "/admin/coupons", label: "Coupons", icon: Ticket }],
  },
  {
    label: "Payments",
    items: [
      { to: "/admin/payments", label: "Transactions", icon: CreditCard },
      { to: "/admin/refunds", label: "Refunds", icon: Banknote },
    ],
  },
  {
    label: "Shipping",
    items: [
      {
        to: "/admin/orders",
        label: "Shipments",
        icon: Truck,
        search: { status: "Shipped" },
        match: (p, s) => p.startsWith("/admin/orders") && s.includes("status=Shipped"),
      },
      { to: "/admin/shipping", label: "Shipping Settings", icon: Settings },
    ],
  },
  {
    items: [{ to: "/admin/analytics", label: "Analytics", icon: BarChart3 }],
  },
  {
    label: "Administration",
    items: [
      { to: "/admin/users", label: "Admin Users", icon: Shield },
      { to: "/admin/roles", label: "Roles & Permissions", icon: KeyRound },
      { to: "/admin/audit", label: "Audit Logs", icon: ScrollText },
      { to: "/admin/notifications", label: "Notifications", icon: Bell },
      { to: "/admin/support", label: "Support", icon: MessageSquare },
      { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
    ],
  },
  {
    label: "CMS",
    items: [
      {
        to: "/admin/cms",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
        match: (p) => p === "/admin/cms" || p === "/admin/cms/",
      },
      { to: "/admin/cms/homepage", label: "Homepage", icon: Store },
      { to: "/admin/cms/banners", label: "Banners", icon: Image },
      { to: "/admin/cms/pages", label: "Pages", icon: FileText },
      { to: "/admin/cms/blog", label: "Blog", icon: Newspaper },
      { to: "/admin/cms/media", label: "Media Library", icon: Images },
      { to: "/admin/cms/navigation", label: "Navigation", icon: Menu },
      { to: "/admin/cms/seo", label: "SEO", icon: Search },
      { to: "/admin/cms/settings", label: "CMS Settings", icon: Settings },
    ],
  },
  {
    items: [{ to: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

function isNavActive(item: NavItem, pathname: string, searchStr: string) {
  if (item.match) return item.match(pathname, searchStr);
  if (item.exact) return pathname === item.to || pathname === `${item.to}/`;
  if (item.to === "/admin/products/new") return pathname === "/admin/products/new";
  if (item.to === "/admin/products") {
    return pathname.startsWith("/admin/products") && pathname !== "/admin/products/new";
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    const token = typeof window !== "undefined" ? getAuthToken() : null;
    const user = typeof window !== "undefined" ? getStoredUser() : null;
    if (!token || !isStaffRole(user?.role)) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background p-4">
        <Link to="/admin" className="mb-5 px-2 font-display text-xl font-black tracking-tighter">
          SOLE<span className="text-accent">.</span> Admin
        </Link>
        <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
          {NAV.map((group, gi) => {
            const groupKey = group.label
              ? `navgroup-${group.label.toLowerCase()}`
              : `navgroup-idx-${gi}`;
            return (
              <div key={groupKey}>
                {group.label && (
                  <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item, itemIdx) => {
                    const isActive = isNavActive(item, pathname, searchStr);
                    const Icon = item.icon;
                    const itemKey = `${groupKey}-${item.to}-${item.label}-${itemIdx}`;
                    return (
                      <Link
                        key={itemKey}
                        to={item.to}
                        search={item.search as never}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                          isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
        <Link
          to="/"
          className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Store className="h-4 w-4" /> Storefront
        </Link>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
