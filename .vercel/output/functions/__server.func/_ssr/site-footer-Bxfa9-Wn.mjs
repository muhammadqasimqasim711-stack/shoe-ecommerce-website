import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Facebook, L as Instagram, c as Twitter, t as Youtube } from "../_libs/lucide-react.mjs";
import { f as useCmsNav, p as useCmsSettings } from "./site-header-JEgEYlzV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-footer-Bxfa9-Wn.js
var import_jsx_runtime = require_jsx_runtime();
var SOCIAL_BRANDS = {
	instagram: {
		Icon: Instagram,
		label: "Instagram",
		defaultUrl: "https://www.instagram.com",
		className: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 border-none"
	},
	facebook: {
		Icon: Facebook,
		label: "Facebook",
		defaultUrl: "https://www.facebook.com",
		className: "bg-[#1877F2] text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border-none"
	},
	twitter: {
		Icon: Twitter,
		label: "Twitter",
		defaultUrl: "https://x.com",
		className: "bg-[#1DA1F2] text-white hover:scale-110 hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 border-none"
	},
	youtube: {
		Icon: Youtube,
		label: "YouTube",
		defaultUrl: "https://www.youtube.com",
		className: "bg-[#FF0000] text-white hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 border-none"
	}
};
var FALLBACK_SHOP = [
	{
		label: "New Arrivals",
		url: "/shop?sort=newest&days=30"
	},
	{
		label: "Men",
		url: "/shop?gender=men"
	},
	{
		label: "Women",
		url: "/shop?gender=women"
	},
	{
		label: "Kids",
		url: "/shop?gender=kids"
	},
	{
		label: "Sale",
		url: "/shop?onSale=true"
	}
];
var FALLBACK_HELP = [
	{
		label: "Shipping",
		url: "/help/shipping"
	},
	{
		label: "Returns",
		url: "/help/returns"
	},
	{
		label: "Size Guide",
		url: "/help/size-guide"
	},
	{
		label: "FAQ",
		url: "/help/faq"
	},
	{
		label: "Contact",
		url: "/help/contact"
	}
];
var FALLBACK_COMPANY = [
	{
		label: "About",
		url: "/company/about"
	},
	{
		label: "Careers",
		url: "/company/careers"
	},
	{
		label: "Press",
		url: "/company/press"
	},
	{
		label: "Sustainability",
		url: "/company/sustainability"
	},
	{
		label: "Stores",
		url: "/company/stores"
	}
];
var FALLBACK_LEGAL = [
	{
		label: "Privacy",
		url: "/legal/privacy"
	},
	{
		label: "Terms",
		url: "/legal/terms"
	},
	{
		label: "Cookies",
		url: "/legal/cookies"
	}
];
function SiteFooter() {
	const { data: nav } = useCmsNav();
	const { data: settings } = useCmsSettings();
	const shop = nav?.footer_shop?.length ? nav.footer_shop : FALLBACK_SHOP;
	const help = nav?.footer_help?.length ? nav.footer_help : FALLBACK_HELP;
	const company = nav?.footer_company?.length ? nav.footer_company : FALLBACK_COMPANY;
	const legal = nav?.footer_legal?.length ? nav.footer_legal : FALLBACK_LEGAL;
	const social = settings?.social ?? {};
	const footerText = typeof settings?.footerText === "string" && settings.footerText || "Premium footwear for the ones who move different. Crafted for performance, designed for life.";
	const storeName = typeof settings?.storeName === "string" && settings.storeName || "SOLE";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-primary text-primary-foreground pt-16 pb-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-12 grid grid-cols-2 gap-8 md:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 font-display text-3xl font-black tracking-tighter",
								children: [storeName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-6 max-w-xs text-sm text-white/60",
								children: footerText
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-3",
								children: Object.keys(SOCIAL_BRANDS).map((key) => {
									const brand = SOCIAL_BRANDS[key];
									const href = social[key] || social[key.toLowerCase()] || brand.defaultUrl;
									const Icon = brand.Icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href,
										target: "_blank",
										rel: "noopener noreferrer",
										"aria-label": brand.label,
										title: brand.label,
										className: `grid h-10 w-10 place-items-center rounded-full shadow-sm ${brand.className}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 stroke-[2.2]" })
									}, key);
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Shop",
						items: shop
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Help",
						items: help
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Company",
						items: company
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					storeName,
					". All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4",
					children: [legal.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.url,
						className: "hover:text-accent",
						children: l.label
					}, l.url)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/blog",
						className: "hover:text-accent",
						children: "Journal"
					})]
				})]
			})]
		})
	});
}
function FooterCol({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		className: "mb-4 text-sm font-semibold uppercase tracking-wider",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2 text-sm text-white/60",
		children: items.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: l.url,
			className: "hover:text-accent",
			children: l.label
		}) }, `${l.label}-${l.url}`))
	})] });
}
//#endregion
export { SiteFooter as t };
