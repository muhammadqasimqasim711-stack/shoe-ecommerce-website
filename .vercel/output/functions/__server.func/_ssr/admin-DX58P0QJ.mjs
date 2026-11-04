import { t as cn } from "./utils-C_uf36nf.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as MessageSquare, C as ScrollText, D as Package, F as LayoutDashboard, I as KeyRound, N as Mail, O as Newspaper, R as Image, S as Search, T as Plus, U as Funnel, W as FileText, Y as CreditCard, f as Ticket, h as Star, i as Users, it as Bell, j as Menu, l as Truck, m as Store, nt as ChartColumn, ot as Banknote, p as Tags, r as Warehouse, v as ShoppingBag, w as RotateCcw, x as Settings, y as Shield, z as Images } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DX58P0QJ.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{ items: [{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	}] },
	{
		label: "Catalog",
		items: [
			{
				to: "/admin/products",
				label: "Products",
				icon: Package
			},
			{
				to: "/admin/products/new",
				label: "Add Product",
				icon: Plus
			},
			{
				to: "/admin/categories",
				label: "Categories",
				icon: Tags
			},
			{
				to: "/admin/inventory",
				label: "Inventory",
				icon: Warehouse
			},
			{
				to: "/admin/reviews",
				label: "Reviews",
				icon: Star
			}
		]
	},
	{
		label: "Orders",
		items: [
			{
				to: "/admin/orders",
				label: "All Orders",
				icon: ShoppingBag,
				match: (p, s) => p.startsWith("/admin/orders") && !s.includes("status=Shipped")
			},
			{
				to: "/admin/returns",
				label: "Returns",
				icon: RotateCcw
			},
			{
				to: "/admin/refunds",
				label: "Refunds",
				icon: Banknote
			}
		]
	},
	{
		label: "CRM",
		items: [
			{
				to: "/admin/crm",
				label: "CRM Overview",
				icon: LayoutDashboard,
				exact: true
			},
			{
				to: "/admin/customers",
				label: "Customers",
				icon: Users
			},
			{
				to: "/admin/segments",
				label: "Segments",
				icon: Funnel
			}
		]
	},
	{
		label: "Marketing",
		items: [{
			to: "/admin/coupons",
			label: "Coupons",
			icon: Ticket
		}]
	},
	{
		label: "Payments",
		items: [{
			to: "/admin/payments",
			label: "Transactions",
			icon: CreditCard
		}, {
			to: "/admin/refunds",
			label: "Refunds",
			icon: Banknote
		}]
	},
	{
		label: "Shipping",
		items: [{
			to: "/admin/orders",
			label: "Shipments",
			icon: Truck,
			search: { status: "Shipped" },
			match: (p, s) => p.startsWith("/admin/orders") && s.includes("status=Shipped")
		}, {
			to: "/admin/shipping",
			label: "Shipping Settings",
			icon: Settings
		}]
	},
	{ items: [{
		to: "/admin/analytics",
		label: "Analytics",
		icon: ChartColumn
	}] },
	{
		label: "Administration",
		items: [
			{
				to: "/admin/users",
				label: "Admin Users",
				icon: Shield
			},
			{
				to: "/admin/roles",
				label: "Roles & Permissions",
				icon: KeyRound
			},
			{
				to: "/admin/audit",
				label: "Audit Logs",
				icon: ScrollText
			},
			{
				to: "/admin/notifications",
				label: "Notifications",
				icon: Bell
			},
			{
				to: "/admin/support",
				label: "Support",
				icon: MessageSquare
			},
			{
				to: "/admin/newsletter",
				label: "Newsletter",
				icon: Mail
			}
		]
	},
	{
		label: "CMS",
		items: [
			{
				to: "/admin/cms",
				label: "Dashboard",
				icon: LayoutDashboard,
				exact: true,
				match: (p) => p === "/admin/cms" || p === "/admin/cms/"
			},
			{
				to: "/admin/cms/homepage",
				label: "Homepage",
				icon: Store
			},
			{
				to: "/admin/cms/banners",
				label: "Banners",
				icon: Image
			},
			{
				to: "/admin/cms/pages",
				label: "Pages",
				icon: FileText
			},
			{
				to: "/admin/cms/blog",
				label: "Blog",
				icon: Newspaper
			},
			{
				to: "/admin/cms/media",
				label: "Media Library",
				icon: Images
			},
			{
				to: "/admin/cms/navigation",
				label: "Navigation",
				icon: Menu
			},
			{
				to: "/admin/cms/seo",
				label: "SEO",
				icon: Search
			},
			{
				to: "/admin/cms/settings",
				label: "CMS Settings",
				icon: Settings
			}
		]
	},
	{ items: [{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings
	}] }
];
function isNavActive(item, pathname, searchStr) {
	if (item.match) return item.match(pathname, searchStr);
	if (item.exact) return pathname === item.to || pathname === `${item.to}/`;
	if (item.to === "/admin/products/new") return pathname === "/admin/products/new";
	if (item.to === "/admin/products") return pathname.startsWith("/admin/products") && pathname !== "/admin/products/new";
	return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
function AdminLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const searchStr = useRouterState({ select: (s) => s.location.searchStr });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-muted/30 text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-60 shrink-0 flex-col border-r border-border bg-background p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "mb-5 px-2 font-display text-xl font-black tracking-tighter",
					children: [
						"SOLE",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-accent",
							children: "."
						}),
						" Admin"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 space-y-4 overflow-y-auto pr-1",
					children: NAV.map((group, gi) => {
						const groupKey = group.label ? `navgroup-${group.label.toLowerCase()}` : `navgroup-idx-${gi}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [group.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: group.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-0.5",
							children: group.items.map((item, itemIdx) => {
								const isActive = isNavActive(item, pathname, searchStr);
								const Icon = item.icon;
								const itemKey = `${groupKey}-${item.to}-${item.label}-${itemIdx}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									search: item.search,
									className: cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition", isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), item.label]
								}, itemKey);
							})
						})] }, groupKey);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }), " Storefront"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 overflow-auto p-6 md:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };
