import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$53 } from "./admin.cms.blog._id-C2ql6IJF.mjs";
import { t as Route$54 } from "./admin.cms.pages._id-CnitYR2G.mjs";
import { t as Route$55 } from "./admin.customers._id-_zPzMF62.mjs";
import { t as Route$56 } from "./admin.customers.index-EUn5OWQ9.mjs";
import { t as Route$57 } from "./admin.inventory-D6X_YLBH.mjs";
import { t as Route$58 } from "./admin.orders._id-BZZl1hVl.mjs";
import { t as Route$59 } from "./admin.orders.index-DVA0zKZE.mjs";
import { t as Route$60 } from "./admin.products._id-BHat_YYR.mjs";
import { t as Route$61 } from "./admin.products.index-hjDPobRr.mjs";
import { n as isStaffRole } from "./types-BdW_FQEI.mjs";
import { t as cmsDocumentHead } from "./cms-seo-Bd2I2Zdg.mjs";
import { t as Route$62 } from "./blog._slug-DTpYf5yf.mjs";
import { a as getStoredUser, i as getAuthToken, n as LocaleProvider, t as FlyCartProvider } from "./auth-storage-BIZ_cztO.mjs";
import { t as Route$63 } from "./company._slug-BJKZo3R_.mjs";
import { t as Route$64 } from "./help._slug-BP9GNTTQ.mjs";
import { t as Route$65 } from "./legal._slug-ChQDUhV7.mjs";
import { t as Route$66 } from "./login-Z4AswexL.mjs";
import { t as Route$67 } from "./orders._orderId.confirmation-H5HvKwrw.mjs";
import { t as Route$68 } from "./products._id-BclVDRlr.mjs";
import { t as Route$69 } from "./shop-DOkwor4a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CxnXI1_n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Cw3Ux06b.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$52 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SOLE — Premium Sneakers & Performance Footwear" },
			{
				name: "description",
				content: "Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "SOLE — Premium Sneakers & Performance Footwear"
			},
			{
				property: "og:description",
				content: "Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "SOLE — Premium Sneakers & Performance Footwear"
			},
			{
				name: "twitter:description",
				content: "Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5136b603-7e20-46d7-8dcb-3d62e7cbc74f/id-preview-edd2bf97--8e7e721e-de3f-4ccf-a26f-f0aa3a7d517b.lovable.app-1783248746101.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5136b603-7e20-46d7-8dcb-3d62e7cbc74f/id-preview-edd2bf97--8e7e721e-de3f-4ccf-a26f-f0aa3a7d517b.lovable.app-1783248746101.png"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		"data-tsd-source": void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", {
			"data-tsd-source": void 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			"data-tsd-source": void 0,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$52.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FlyCartProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }) })
	});
}
var $$splitComponentImporter$51 = () => import("./wishlist-BGb7cp89.mjs");
var Route$51 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — SOLE" }, {
		name: "description",
		content: "Your saved sneakers and footwear at SOLE."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./register-CV_gKW1d.mjs");
var Route$50 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Create account — SOLE" }, {
		name: "description",
		content: "Create your SOLE account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var $$splitComponentImporter$49 = () => import("./lookbook-CYBJeISm.mjs");
var Route$49 = createFileRoute("/lookbook")({
	head: () => ({ meta: [{ title: "Summer '26 Lookbook — SOLE" }, {
		name: "description",
		content: "Explore the SOLE Summer '26 collection lookbook."
	}] }),
	loader: ({ context }) => context.queryClient.ensureQueryData({
		queryKey: [
			"products",
			"lookbook",
			"summer-26"
		],
		queryFn: () => api.getProducts({
			collection: "summer-26",
			limit: 100
		})
	}),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("./legal-CoeWCTtk.mjs");
var Route$48 = createFileRoute("/legal")({ component: lazyRouteComponent($$splitComponentImporter$48, "component") });
var $$splitComponentImporter$47 = () => import("./help-D_HO_ctz.mjs");
var Route$47 = createFileRoute("/help")({ component: lazyRouteComponent($$splitComponentImporter$47, "component") });
var $$splitComponentImporter$46 = () => import("./company-CQTH4agT.mjs");
var Route$46 = createFileRoute("/company")({ component: lazyRouteComponent($$splitComponentImporter$46, "component") });
var $$splitComponentImporter$45 = () => import("./checkout-DEfRlaZc.mjs");
var Route$45 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — SOLE" }, {
		name: "description",
		content: "Complete your SOLE order."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./cart-D96wNHL8.mjs");
var Route$44 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "Cart — SOLE" }, {
		name: "description",
		content: "Review your bag and checkout at SOLE."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./brands-DcQBKFX0.mjs");
var Route$43 = createFileRoute("/brands")({
	head: () => ({ meta: [{ title: "Brands — SOLE" }, {
		name: "description",
		content: "Shop premium sneaker brands at SOLE."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./blog-GHsbigBI.mjs");
var Route$42 = createFileRoute("/blog")({ component: lazyRouteComponent($$splitComponentImporter$42, "component") });
var $$splitComponentImporter$41 = () => import("./admin-DX58P0QJ.mjs");
var Route$41 = createFileRoute("/admin")({
	beforeLoad: ({ location }) => {
		const token = typeof window !== "undefined" ? getAuthToken() : null;
		const user = typeof window !== "undefined" ? getStoredUser() : null;
		if (!token || !isStaffRole(user?.role)) throw redirect({
			to: "/login",
			search: { redirect: location.pathname }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./routes-fX6oEkar.mjs");
var Route$40 = createFileRoute("/")({
	loader: async ({ context }) => {
		context.queryClient.prefetchQuery({
			queryKey: ["catalog", "home"],
			queryFn: () => import("./api-CkEPFrmT.mjs").then((n) => n.r).then((n) => n.r).then((m) => m.api.getHomeCatalog())
		});
		context.queryClient.prefetchQuery({
			queryKey: ["brands"],
			queryFn: () => import("./api-CkEPFrmT.mjs").then((n) => n.r).then((n) => n.r).then((m) => m.api.getBrands())
		});
		context.queryClient.prefetchQuery({
			queryKey: ["cms", "home"],
			queryFn: () => import("./api-CkEPFrmT.mjs").then((n) => n.r).then((n) => n.r).then((m) => m.api.getCmsHome())
		});
		context.queryClient.prefetchQuery({
			queryKey: ["cms", "nav"],
			queryFn: () => import("./api-CkEPFrmT.mjs").then((n) => n.r).then((n) => n.r).then((m) => m.api.getCmsNav())
		});
		context.queryClient.prefetchQuery({
			queryKey: ["cms", "banners"],
			queryFn: () => import("./api-CkEPFrmT.mjs").then((n) => n.r).then((n) => n.r).then((m) => m.api.getCmsBanners())
		});
		return { settings: await context.queryClient.ensureQueryData({
			queryKey: ["cms", "settings"],
			queryFn: () => import("./api-CkEPFrmT.mjs").then((n) => n.r).then((n) => n.r).then((m) => m.api.getCmsSettings())
		}).catch(() => void 0) };
	},
	head: ({ loaderData }) => {
		const settings = loaderData?.settings;
		const seo = cmsDocumentHead({
			title: settings?.defaultSeoTitle || "SOLE — Premium Sneakers & Performance Footwear",
			seoDescription: settings?.defaultSeoDescription || "Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns.",
			ogImage: settings?.defaultOgImage,
			canonicalUrl: "/"
		}, "SOLE — Premium Sneakers & Performance Footwear", "Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns.");
		return {
			...seo,
			links: [
				...seo.links,
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com"
				},
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossOrigin: "anonymous"
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap"
				}
			]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./help.index-cjmel3S9.mjs");
var Route$39 = createFileRoute("/help/")({
	head: () => ({ meta: [{ title: "Help — SOLE" }, {
		name: "description",
		content: "Shipping, returns, size guide, FAQ, and contact support at SOLE."
	}] }),
	loader: ({ context }) => context.queryClient.ensureQueryData({
		queryKey: ["cms", "pages"],
		queryFn: () => api.getCmsPages()
	}),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./company.index-BCf_mmfm.mjs");
var Route$38 = createFileRoute("/company/")({
	head: () => ({ meta: [{ title: "Company — SOLE" }, {
		name: "description",
		content: "About SOLE, careers, press, sustainability, and stores."
	}] }),
	loader: ({ context }) => context.queryClient.ensureQueryData({
		queryKey: ["cms", "pages"],
		queryFn: () => api.getCmsPages()
	}),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./blog.index-DcWuwFEf.mjs");
var Route$37 = createFileRoute("/blog/")({
	head: () => ({ meta: [{ title: "Journal — SOLE" }, {
		name: "description",
		content: "Stories, drops, and news from SOLE."
	}] }),
	loader: ({ context }) => context.queryClient.ensureQueryData({
		queryKey: ["cms", "blog"],
		queryFn: () => api.getCmsBlog()
	}),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./admin.index-fiTKk-lQ.mjs");
var Route$36 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
var $$splitComponentImporter$35 = () => import("./admin.users-DGdzez8p.mjs");
var Route$35 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$35, "component") });
var $$splitComponentImporter$34 = () => import("./admin.support-Cv1md5VF.mjs");
var Route$34 = createFileRoute("/admin/support")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./admin.shipping-PYNVibgb.mjs");
var Route$33 = createFileRoute("/admin/shipping")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./admin.settings-DuziyVPj.mjs");
var Route$32 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$32, "component") });
var $$splitComponentImporter$31 = () => import("./admin.segments-YdEAMSPM.mjs");
var Route$31 = createFileRoute("/admin/segments")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
var $$splitComponentImporter$30 = () => import("./admin.roles-x83MKC2I.mjs");
var Route$30 = createFileRoute("/admin/roles")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./admin.reviews-B2IF86GC.mjs");
var Route$29 = createFileRoute("/admin/reviews")({ component: lazyRouteComponent($$splitComponentImporter$29, "component") });
var $$splitComponentImporter$28 = () => import("./admin.returns-BksEn9hr.mjs");
var Route$28 = createFileRoute("/admin/returns")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./admin.refunds-DEPwUbhY.mjs");
var Route$27 = createFileRoute("/admin/refunds")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./admin.products-ClDUrDmi.mjs");
var Route$26 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./admin.payments-Do5TyAsY.mjs");
var Route$25 = createFileRoute("/admin/payments")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./admin.orders-ByKocBSM.mjs");
var Route$24 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./admin.notifications-BvLlRx4y.mjs");
var Route$23 = createFileRoute("/admin/notifications")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./admin.newsletter-Kn6Bj6y8.mjs");
var Route$22 = createFileRoute("/admin/newsletter")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./admin.customers-uTQjjpSF.mjs");
var Route$21 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./admin.crm-Bzj6X4pl.mjs");
var Route$20 = createFileRoute("/admin/crm")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./admin.coupons-Dxm5RfqX.mjs");
var Route$19 = createFileRoute("/admin/coupons")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.cms-D37PgG-j.mjs");
var Route$18 = createFileRoute("/admin/cms")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.categories-COH8uLB-.mjs");
var Route$17 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin.brands-D2uUQSXx.mjs");
var Route$16 = createFileRoute("/admin/brands")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin.audit-DCkVu702.mjs");
var Route$15 = createFileRoute("/admin/audit")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.analytics-BM0uO781.mjs");
var Route$14 = createFileRoute("/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin.cms.index-f2uBhfnj.mjs");
var Route$13 = createFileRoute("/admin/cms/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.products.new-Cotl2Sof.mjs");
var Route$12 = createFileRoute("/admin/products/new")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.cms.settings-C9bzWPEK.mjs");
var Route$11 = createFileRoute("/admin/cms/settings")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.cms.seo-vrcENWKj.mjs");
var Route$10 = createFileRoute("/admin/cms/seo")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.cms.pages-CtuBAn1z.mjs");
var Route$9 = createFileRoute("/admin/cms/pages")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.cms.navigation-BUrQXk-2.mjs");
var Route$8 = createFileRoute("/admin/cms/navigation")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.cms.media-2sDW8c02.mjs");
var Route$7 = createFileRoute("/admin/cms/media")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.cms.homepage-0HpOT-EJ.mjs");
var Route$6 = createFileRoute("/admin/cms/homepage")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.cms.blog-DWhwZ997.mjs");
var Route$5 = createFileRoute("/admin/cms/blog")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.cms.banners-CB5YWWPs.mjs");
var Route$4 = createFileRoute("/admin/cms/banners")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.cms.pages.index-CP55daHf.mjs");
var Route$3 = createFileRoute("/admin/cms/pages/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.cms.blog.index-CnkW7Tkf.mjs");
var Route$2 = createFileRoute("/admin/cms/blog/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.cms.pages.new-CwqiQCi1.mjs");
var Route$1 = createFileRoute("/admin/cms/pages/new")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.cms.blog.new-BHGjvnwW.mjs");
var Route = createFileRoute("/admin/cms/blog/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var WishlistRoute = Route$51.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$52
});
var ShopRoute = Route$69.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$52
});
var RegisterRoute = Route$50.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$52
});
var LookbookRoute = Route$49.update({
	id: "/lookbook",
	path: "/lookbook",
	getParentRoute: () => Route$52
});
var LoginRoute = Route$66.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$52
});
var LegalRoute = Route$48.update({
	id: "/legal",
	path: "/legal",
	getParentRoute: () => Route$52
});
var HelpRoute = Route$47.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$52
});
var CompanyRoute = Route$46.update({
	id: "/company",
	path: "/company",
	getParentRoute: () => Route$52
});
var CheckoutRoute = Route$45.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$52
});
var CartRoute = Route$44.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$52
});
var BrandsRoute = Route$43.update({
	id: "/brands",
	path: "/brands",
	getParentRoute: () => Route$52
});
var BlogRoute = Route$42.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$52
});
var AdminRoute = Route$41.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$52
});
var IndexRoute = Route$40.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$52
});
var HelpIndexRoute = Route$39.update({
	id: "/",
	path: "/",
	getParentRoute: () => HelpRoute
});
var CompanyIndexRoute = Route$38.update({
	id: "/",
	path: "/",
	getParentRoute: () => CompanyRoute
});
var BlogIndexRoute = Route$37.update({
	id: "/",
	path: "/",
	getParentRoute: () => BlogRoute
});
var AdminIndexRoute = Route$36.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var ProductsIdRoute = Route$68.update({
	id: "/products/$id",
	path: "/products/$id",
	getParentRoute: () => Route$52
});
var LegalSlugRoute = Route$65.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => LegalRoute
});
var HelpSlugRoute = Route$64.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => HelpRoute
});
var CompanySlugRoute = Route$63.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => CompanyRoute
});
var BlogSlugRoute = Route$62.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var AdminUsersRoute = Route$35.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var AdminSupportRoute = Route$34.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => AdminRoute
});
var AdminShippingRoute = Route$33.update({
	id: "/shipping",
	path: "/shipping",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$32.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminSegmentsRoute = Route$31.update({
	id: "/segments",
	path: "/segments",
	getParentRoute: () => AdminRoute
});
var AdminRolesRoute = Route$30.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => AdminRoute
});
var AdminReviewsRoute = Route$29.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => AdminRoute
});
var AdminReturnsRoute = Route$28.update({
	id: "/returns",
	path: "/returns",
	getParentRoute: () => AdminRoute
});
var AdminRefundsRoute = Route$27.update({
	id: "/refunds",
	path: "/refunds",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$26.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminPaymentsRoute = Route$25.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$24.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminNotificationsRoute = Route$23.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AdminRoute
});
var AdminNewsletterRoute = Route$22.update({
	id: "/newsletter",
	path: "/newsletter",
	getParentRoute: () => AdminRoute
});
var AdminInventoryRoute = Route$57.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$21.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminCrmRoute = Route$20.update({
	id: "/crm",
	path: "/crm",
	getParentRoute: () => AdminRoute
});
var AdminCouponsRoute = Route$19.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AdminRoute
});
var AdminCmsRoute = Route$18.update({
	id: "/cms",
	path: "/cms",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$17.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminBrandsRoute = Route$16.update({
	id: "/brands",
	path: "/brands",
	getParentRoute: () => AdminRoute
});
var AdminAuditRoute = Route$15.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AdminRoute
});
var AdminAnalyticsRoute = Route$14.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AdminRoute
});
var AdminProductsIndexRoute = Route$61.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminProductsRoute
});
var AdminOrdersIndexRoute = Route$59.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminOrdersRoute
});
var AdminCustomersIndexRoute = Route$56.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminCustomersRoute
});
var AdminCmsIndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminCmsRoute
});
var OrdersOrderIdConfirmationRoute = Route$67.update({
	id: "/orders/$orderId/confirmation",
	path: "/orders/$orderId/confirmation",
	getParentRoute: () => Route$52
});
var AdminProductsNewRoute = Route$12.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AdminProductsRoute
});
var AdminProductsIdRoute = Route$60.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminProductsRoute
});
var AdminOrdersIdRoute = Route$58.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminOrdersRoute
});
var AdminCustomersIdRoute = Route$55.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminCustomersRoute
});
var AdminCmsSettingsRoute = Route$11.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsSeoRoute = Route$10.update({
	id: "/seo",
	path: "/seo",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsPagesRoute = Route$9.update({
	id: "/pages",
	path: "/pages",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsNavigationRoute = Route$8.update({
	id: "/navigation",
	path: "/navigation",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsMediaRoute = Route$7.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsHomepageRoute = Route$6.update({
	id: "/homepage",
	path: "/homepage",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsBlogRoute = Route$5.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsBannersRoute = Route$4.update({
	id: "/banners",
	path: "/banners",
	getParentRoute: () => AdminCmsRoute
});
var AdminCmsPagesIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminCmsPagesRoute
});
var AdminCmsBlogIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminCmsBlogRoute
});
var AdminCmsPagesNewRoute = Route$1.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AdminCmsPagesRoute
});
var AdminCmsPagesIdRoute = Route$54.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminCmsPagesRoute
});
var AdminCmsBlogNewRoute = Route.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AdminCmsBlogRoute
});
var AdminCmsBlogRouteChildren = {
	AdminCmsBlogIdRoute: Route$53.update({
		id: "/$id",
		path: "/$id",
		getParentRoute: () => AdminCmsBlogRoute
	}),
	AdminCmsBlogNewRoute,
	AdminCmsBlogIndexRoute
};
var AdminCmsBlogRouteWithChildren = AdminCmsBlogRoute._addFileChildren(AdminCmsBlogRouteChildren);
var AdminCmsPagesRouteChildren = {
	AdminCmsPagesIdRoute,
	AdminCmsPagesNewRoute,
	AdminCmsPagesIndexRoute
};
var AdminCmsRouteChildren = {
	AdminCmsBannersRoute,
	AdminCmsBlogRoute: AdminCmsBlogRouteWithChildren,
	AdminCmsHomepageRoute,
	AdminCmsMediaRoute,
	AdminCmsNavigationRoute,
	AdminCmsPagesRoute: AdminCmsPagesRoute._addFileChildren(AdminCmsPagesRouteChildren),
	AdminCmsSeoRoute,
	AdminCmsSettingsRoute,
	AdminCmsIndexRoute
};
var AdminCmsRouteWithChildren = AdminCmsRoute._addFileChildren(AdminCmsRouteChildren);
var AdminCustomersRouteChildren = {
	AdminCustomersIdRoute,
	AdminCustomersIndexRoute
};
var AdminCustomersRouteWithChildren = AdminCustomersRoute._addFileChildren(AdminCustomersRouteChildren);
var AdminOrdersRouteChildren = {
	AdminOrdersIdRoute,
	AdminOrdersIndexRoute
};
var AdminOrdersRouteWithChildren = AdminOrdersRoute._addFileChildren(AdminOrdersRouteChildren);
var AdminProductsRouteChildren = {
	AdminProductsIdRoute,
	AdminProductsNewRoute,
	AdminProductsIndexRoute
};
var AdminRouteChildren = {
	AdminAnalyticsRoute,
	AdminAuditRoute,
	AdminBrandsRoute,
	AdminCategoriesRoute,
	AdminCmsRoute: AdminCmsRouteWithChildren,
	AdminCouponsRoute,
	AdminCrmRoute,
	AdminCustomersRoute: AdminCustomersRouteWithChildren,
	AdminInventoryRoute,
	AdminNewsletterRoute,
	AdminNotificationsRoute,
	AdminOrdersRoute: AdminOrdersRouteWithChildren,
	AdminPaymentsRoute,
	AdminProductsRoute: AdminProductsRoute._addFileChildren(AdminProductsRouteChildren),
	AdminRefundsRoute,
	AdminReturnsRoute,
	AdminReviewsRoute,
	AdminRolesRoute,
	AdminSegmentsRoute,
	AdminSettingsRoute,
	AdminShippingRoute,
	AdminSupportRoute,
	AdminUsersRoute,
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var BlogRouteChildren = {
	BlogSlugRoute,
	BlogIndexRoute
};
var BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
var CompanyRouteChildren = {
	CompanySlugRoute,
	CompanyIndexRoute
};
var CompanyRouteWithChildren = CompanyRoute._addFileChildren(CompanyRouteChildren);
var HelpRouteChildren = {
	HelpSlugRoute,
	HelpIndexRoute
};
var HelpRouteWithChildren = HelpRoute._addFileChildren(HelpRouteChildren);
var LegalRouteChildren = { LegalSlugRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	BlogRoute: BlogRouteWithChildren,
	BrandsRoute,
	CartRoute,
	CheckoutRoute,
	CompanyRoute: CompanyRouteWithChildren,
	HelpRoute: HelpRouteWithChildren,
	LegalRoute: LegalRoute._addFileChildren(LegalRouteChildren),
	LoginRoute,
	LookbookRoute,
	RegisterRoute,
	ShopRoute,
	WishlistRoute,
	ProductsIdRoute,
	OrdersOrderIdConfirmationRoute
};
var routeTree = Route$52._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			staleTime: 3e4,
			gcTime: 5 * 6e4,
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				if (error instanceof Error && "status" in error && error.status === 401) return false;
				return failureCount < 2;
			}
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
