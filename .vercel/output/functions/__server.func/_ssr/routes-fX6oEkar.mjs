import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { $ as ChevronRight, P as LogOut, V as Headphones, at as BellOff, b as ShieldCheck, et as ChevronDown, h as Star, it as Bell, l as Truck, s as UserCheck, st as ArrowRight, tt as Check, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as api } from "./api-CkEPFrmT.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DKYmpD03.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuSeparator, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-lm0fXf4o.mjs";
import { c as useFlyCart, l as useLocale } from "./auth-storage-BIZ_cztO.mjs";
import { a as str, c as useCart, d as useCmsHome, i as sectionPayload, m as useHomeCatalog, n as SiteHeader, p as useCmsSettings, r as pickDisplayProducts, s as useBrands, t as LocaleSwitcher, u as useCmsBanners } from "./site-header-JEgEYlzV.mjs";
import { t as SiteFooter } from "./site-footer-Bxfa9-Wn.mjs";
import { t as ProductImage } from "./product-image-ClW4tcdv.mjs";
import { t as WishlistButton } from "./wishlist-button-C3Q3xI8x.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-fX6oEkar.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function endOfLocalDay(now = /* @__PURE__ */ new Date()) {
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
}
function remainingParts(target) {
	const ms = Math.max(0, target.getTime() - Date.now());
	const totalSecs = Math.floor(ms / 1e3);
	const hours = Math.floor(totalSecs / 3600);
	const mins = Math.floor(totalSecs % 3600 / 60);
	const secs = totalSecs % 60;
	return {
		hours: String(hours).padStart(2, "0"),
		mins: String(mins).padStart(2, "0"),
		secs: String(secs).padStart(2, "0"),
		ended: ms <= 0
	};
}
function FlashSaleCountdown() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [parts, setParts] = (0, import_react.useState)({
		hours: "00",
		mins: "00",
		secs: "00",
		ended: false
	});
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const tick = () => setParts(remainingParts(endOfLocalDay()));
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, []);
	const displayParts = mounted ? parts : {
		hours: "00",
		mins: "00",
		secs: "00",
		ended: false
	};
	if (displayParts.ended) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm font-medium text-white/70 mb-8 tracking-wider uppercase",
		children: "Sale ended"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-3 mb-8",
		children: [
			[displayParts.hours, "HOURS"],
			[displayParts.mins, "MINS"],
			[displayParts.secs, "SECS"]
		].map(([n, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[80px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-3xl font-black tabular-nums",
				children: n
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] tracking-widest opacity-60",
				children: l
			})]
		}, l))
	});
}
var STORAGE_KEY_EMAIL = "sole_newsletter_email";
var STORAGE_KEY_SUBSCRIBED = "sole_newsletter_subscribed";
var STORAGE_KEY_PREFERENCE = "sole_newsletter_preference";
function NewsletterSubscription() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [isSubscribed, setIsSubscribed] = (0, import_react.useState)(false);
	const [preference, setPreference] = (0, import_react.useState)("ALL");
	const [subscribing, setSubscribing] = (0, import_react.useState)(false);
	const [updatingPref, setUpdatingPref] = (0, import_react.useState)(false);
	const [showUnsubscribeModal, setShowUnsubscribeModal] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const savedEmail = localStorage.getItem(STORAGE_KEY_EMAIL);
			const savedSubscribed = localStorage.getItem(STORAGE_KEY_SUBSCRIBED) === "true";
			const savedPref = localStorage.getItem(STORAGE_KEY_PREFERENCE) || "ALL";
			if (savedEmail) setEmail(savedEmail);
			if (savedSubscribed && savedEmail) {
				setIsSubscribed(true);
				setPreference(savedPref);
				api.getNewsletterStatus(savedEmail).then((res) => {
					if (res) {
						setIsSubscribed(res.isSubscribed);
						if (res.preference) {
							setPreference(res.preference.toUpperCase());
							localStorage.setItem(STORAGE_KEY_PREFERENCE, res.preference.toUpperCase());
						}
					}
				}).catch(() => {});
			}
		} catch {}
	}, []);
	const handleSubscribe = async (e) => {
		e.preventDefault();
		const trimmedEmail = email.trim();
		if (!trimmedEmail || !trimmedEmail.includes("@")) {
			toast.error("Enter a valid email address");
			return;
		}
		setSubscribing(true);
		try {
			await api.subscribeNewsletter(trimmedEmail, preference);
		} catch (err) {
			console.warn("Backend subscription sync warning:", err);
		}
		setIsSubscribed(true);
		toast.success("You're subscribed — check your inbox for 10% off.");
		try {
			confetti_module_default({
				particleCount: 90,
				spread: 80,
				origin: { y: .65 },
				colors: [
					"#10b981",
					"#3b82f6",
					"#f59e0b",
					"#ec4899",
					"#8b5cf6"
				]
			});
		} catch {}
		try {
			localStorage.setItem(STORAGE_KEY_EMAIL, trimmedEmail);
			localStorage.setItem(STORAGE_KEY_SUBSCRIBED, "true");
			localStorage.setItem(STORAGE_KEY_PREFERENCE, preference);
		} catch {}
		setSubscribing(false);
	};
	const handleSelectPreference = async (newPref) => {
		if (newPref === preference) return;
		setUpdatingPref(true);
		setPreference(newPref);
		try {
			localStorage.setItem(STORAGE_KEY_PREFERENCE, newPref);
		} catch {}
		const currentEmail = email.trim() || localStorage.getItem(STORAGE_KEY_EMAIL) || "";
		if (currentEmail) try {
			await api.updateNewsletterPreference(currentEmail, newPref);
		} catch {}
		const label = newPref === "ALL" ? "All notifications" : newPref === "PERSONALIZED" ? "Personalized offers" : "None";
		toast.success(`Subscription preference updated to ${label}.`);
		setUpdatingPref(false);
	};
	const handleConfirmUnsubscribe = async (e) => {
		if (e) e.preventDefault();
		setSubscribing(true);
		const targetEmail = email.trim() || localStorage.getItem(STORAGE_KEY_EMAIL) || "";
		if (targetEmail) try {
			await api.unsubscribeNewsletter(targetEmail);
		} catch (err) {
			console.warn("Backend unsubscribe warning:", err);
		}
		setIsSubscribed(false);
		setEmail("");
		setPreference("ALL");
		setShowUnsubscribeModal(false);
		setSubscribing(false);
		try {
			localStorage.removeItem(STORAGE_KEY_EMAIL);
			localStorage.removeItem(STORAGE_KEY_SUBSCRIBED);
			localStorage.removeItem(STORAGE_KEY_PREFERENCE);
		} catch {}
		toast.success("You have unsubscribed from Sole E-commerce website.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-md mx-auto",
		children: [isSubscribed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-center gap-3 justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "email",
				value: email,
				disabled: true,
				className: "h-12 rounded-full bg-muted/60 px-5 text-center sm:text-left text-muted-foreground cursor-not-allowed font-medium"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "default",
					size: "lg",
					disabled: updatingPref,
					className: "bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 h-12 flex items-center gap-2 transition-all font-semibold shadow-sm w-full sm:w-auto justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subscribed" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-80 ml-1" })
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
				align: "end",
				className: "w-56 rounded-xl p-2 shadow-xl border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
						children: "Notification Preferences"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: () => handleSelectPreference("ALL"),
						className: "cursor-pointer flex items-center justify-between rounded-lg py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All" })]
						}), preference === "ALL" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-600" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: () => handleSelectPreference("PERSONALIZED"),
						className: "cursor-pointer flex items-center justify-between rounded-lg py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Personalized" })]
						}), preference === "PERSONALIZED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-600" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: () => handleSelectPreference("NONE"),
						className: "cursor-pointer flex items-center justify-between rounded-lg py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "None" })]
						}), preference === "NONE" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-600" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: () => setShowUnsubscribeModal(true),
						className: "cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2 rounded-lg py-2 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unsubscribe" })]
					})
				]
			})] })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubscribe,
			className: "flex flex-col sm:flex-row gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "email",
				required: true,
				placeholder: "Enter your email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				className: "h-12 rounded-full bg-background px-5"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				disabled: subscribing,
				className: "bg-primary hover:bg-accent text-primary-foreground rounded-full px-8 h-12",
				children: subscribing ? "…" : "Subscribe"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: showUnsubscribeModal,
			onOpenChange: setShowUnsubscribeModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
				className: "rounded-2xl max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
					className: "font-display text-xl font-bold",
					children: "Unsubscribe from Sole E-commerce website"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
					className: "text-muted-foreground text-sm pt-2",
					children: "Are you sure you want to unsubscribe from Sole E-commerce website updates? You will no longer receive exclusive drop announcements, special discounts, or personalized recommendations."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
					className: "pt-4 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						className: "rounded-full",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: handleConfirmUnsubscribe,
						className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full px-6",
						children: "Unsubscribe"
					})]
				})]
			})
		})]
	});
}
var hero_sneaker_default = "/assets/hero-sneaker-oklUKYq2.jpg";
var shoe_1_default = "/assets/shoe-1-oDtuSEb5.jpg";
var shoe_2_default = "/assets/shoe-2-m2otIHAn.jpg";
var shoe_3_default = "/assets/shoe-3-zVnjM6HX.jpg";
var shoe_4_default = "/assets/shoe-4-BFirSPoA.jpg";
var lifestyle_running_default = "/assets/lifestyle-running-e5rKuiWo.jpg";
var lifestyle_lace_default = "/assets/lifestyle-lace-B8QnxxUZ.jpg";
var fallbackProducts = [
	{
		id: "1",
		name: "Air Runner Pro",
		brand: "Nike",
		price: 189,
		oldPrice: 220,
		img: shoe_1_default,
		tag: "New",
		colors: [
			"#fff",
			"#111",
			"#FF6B00"
		],
		rating: 4.8,
		reviewCount: 312
	},
	{
		id: "2",
		name: "Court Legend High",
		brand: "Jordan",
		price: 245,
		img: shoe_2_default,
		tag: "Trending",
		colors: ["#111", "#5a3a2a"],
		rating: 4.8,
		reviewCount: 312
	},
	{
		id: "3",
		name: "Blaze Trail 3.0",
		brand: "Adidas",
		price: 159,
		oldPrice: 199,
		img: shoe_3_default,
		tag: "-20%",
		colors: [
			"#FF6B00",
			"#111",
			"#fff"
		],
		rating: 4.8,
		reviewCount: 312
	},
	{
		id: "4",
		name: "Classic Suede",
		brand: "Puma",
		price: 129,
		img: shoe_4_default,
		tag: "Bestseller",
		colors: [
			"#c9a37a",
			"#111",
			"#fff"
		],
		rating: 4.8,
		reviewCount: 312
	}
];
var fallbackCategories = [
	{
		id: "running",
		name: "Running",
		count: 128,
		imageUrl: shoe_3_default
	},
	{
		id: "basketball",
		name: "Basketball",
		count: 64,
		imageUrl: shoe_2_default
	},
	{
		id: "lifestyle",
		name: "Lifestyle",
		count: 214,
		imageUrl: shoe_4_default
	},
	{
		id: "training",
		name: "Training",
		count: 92,
		imageUrl: shoe_1_default
	}
];
var fallbackBrands = [
	"NIKE",
	"ADIDAS",
	"PUMA",
	"NEW BALANCE",
	"JORDAN",
	"SKECHERS",
	"ASICS",
	"REEBOK"
];
var categoryFallbackImages = [
	shoe_3_default,
	shoe_2_default,
	shoe_4_default,
	shoe_1_default
];
function Home() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [productFilter, setProductFilter] = (0, import_react.useState)("All");
	const { t, formatMoney } = useLocale();
	const { flyToCart } = useFlyCart();
	const { data: catalog, isLoading, isError, isSuccess } = useHomeCatalog();
	const { data: brandList = [] } = useBrands();
	const { addItem } = useCart();
	const { data: cmsHome } = useCmsHome();
	const { data: cmsBanners = [] } = useCmsBanners();
	const { data: cmsSettings } = useCmsSettings();
	const sections = cmsHome?.sections;
	const announcement = sectionPayload(sections, "announcement");
	const hero = sectionPayload(sections, "hero");
	const valueProps = sectionPayload(sections, "value_props");
	const catCopy = sectionPayload(sections, "featured_categories");
	const prodCopy = sectionPayload(sections, "featured_products");
	const split = sectionPayload(sections, "split");
	const flash = sectionPayload(sections, "flash_sale");
	const testimonials = sectionPayload(sections, "testimonials");
	const newsletter = sectionPayload(sections, "newsletter");
	const splitLeft = split.left ?? {};
	const splitRight = split.right ?? {};
	const valueItems = Array.isArray(valueProps.items) ? valueProps.items : [
		{
			title: "Free Shipping",
			desc: "On orders over $75"
		},
		{
			title: "30-Day Returns",
			desc: "Easy & free returns"
		},
		{
			title: "Authentic Guarantee",
			desc: "100% verified products"
		},
		{
			title: "24/7 Support",
			desc: "Always here to help"
		}
	];
	const heroStats = (Array.isArray(hero.stats) ? hero.stats : [
		{
			value: "2M+",
			label: "Customers"
		},
		{
			value: "500+",
			label: "Styles"
		},
		{
			value: "4.9★",
			label: "Rated"
		}
	]).map((s) => ({
		...s,
		value: s.value ? s.value.replace(/\?|\uFFFD/g, "★") : ""
	}));
	const { data: featuredReviews = [], isLoading: reviewsLoading } = useQuery({
		queryKey: ["reviews", "featured"],
		queryFn: () => api.getReviews({ limit: 3 }),
		staleTime: 6e4
	});
	const products = pickDisplayProducts(catalog, productFilter);
	const usingApi = isSuccess && Boolean(catalog?.products.length);
	const displayProducts = usingApi ? products : fallbackProducts;
	const displayCategories = usingApi && catalog?.categories?.length ? catalog.categories : fallbackCategories;
	const rawMarqueeBrands = brandList.length > 0 ? brandList.map((b) => b.name) : usingApi && catalog?.brands?.length ? catalog.brands : fallbackBrands;
	const marqueeBrands = Array.from(new Set(rawMarqueeBrands.map((b) => b.toUpperCase())));
	const filteredProducts = displayProducts;
	const handleQuickAdd = async (product, clickEvent) => {
		if (clickEvent) flyToCart(clickEvent, product.img);
		if (!product.defaultVariantId) {
			toast.error("This product is not available yet.");
			return;
		}
		try {
			await addItem.mutateAsync(product.defaultVariantId);
			toast.success(`${product.name} added to cart`);
		} catch {
			toast.error("Could not add to cart. Is the backend running?");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-primary text-primary-foreground text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline opacity-70",
							children: t("freeShipping")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 text-center font-medium tracking-wider",
							children: str(announcement, "text", "LIMITED DROP · SUMMER '26 COLLECTION · ENDS SUNDAY")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex gap-4 opacity-70 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/help",
								className: "hover:text-accent transition",
								children: t("help")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSwitcher, {})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {
				search,
				onSearchChange: setSearch
			}),
			cmsBanners.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-accent text-accent-foreground",
				children: cmsBanners.slice(0, 1).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: b.buttonLink || "/shop",
					className: "mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-sm font-medium",
					children: [
						b.desktopImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: b.desktopImageUrl,
							alt: "",
							className: "hidden h-10 w-16 object-cover sm:block"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [b.title, b.subtitle ? ` — ${b.subtitle}` : ""] }),
						b.buttonText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "underline",
							children: b.buttonText
						}) : null
					]
				}, b.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden bg-[oklch(0.08_0_0)] text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl lg:grid-cols-2 items-center gap-8 px-4 py-16 lg:py-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { collection: "summer-26" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-accent text-accent-foreground rounded-full px-3 py-1 uppercase tracking-widest text-xs cursor-pointer hover:opacity-90",
									children: str(hero, "badge", "Summer '26")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter",
								children: str(hero, "heading", "Step Into the Future.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-white/60 max-w-md",
								children: str(hero, "subtitle", "Engineered for the streets. Designed for the extraordinary. The new Air Runner Pro delivers unmatched comfort with a silhouette that defines the era.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 h-12 font-semibold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: str(hero, "ctaUrl", "/shop?collection=summer-26"),
										children: [
											str(hero, "ctaText", "Shop Collection"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4 inline" })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "rounded-full px-8 h-12 border border-white/30 bg-white text-black hover:bg-white/90 font-semibold shadow-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: str(hero, "secondaryCtaUrl", "/lookbook"),
										children: str(hero, "secondaryCtaText", "Explore Lookbook")
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-8 pt-8 border-t border-white/10",
								children: heroStats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-bold",
									children: s.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-white/50 uppercase tracking-wider",
									children: s.label
								})] }, s.label))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-accent/20 blur-3xl rounded-full" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-8 right-8 font-display text-[10rem] lg:text-[14rem] font-black text-white/[0.04] leading-none pointer-events-none",
								children: "01"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: hero_sneaker_default,
								alt: "Featured sneaker",
								width: 1536,
								height: 1536,
								className: "relative w-full drop-shadow-[0_30px_60px_rgba(255,107,0,0.25)]"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-y border-white/10 overflow-hidden py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "marquee flex gap-16 whitespace-nowrap font-display font-black text-3xl text-white/30",
						children: [...marqueeBrands, ...marqueeBrands].map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop",
							search: { brand: b },
							className: "flex items-center gap-16 hover:text-accent transition",
							children: [
								b,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "✦"
								})
							]
						}, `${b}-${i}`))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-7xl md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border",
					children: valueItems.map((v, i) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 px-6 py-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)([
								Truck,
								RotateCcw,
								ShieldCheck,
								Headphones
							][i] ?? Truck, { className: "h-8 w-8 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: v.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: v.desc
							})] })]
						}, v.title);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-4 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
						children: str(catCopy, "eyebrow", "Shop by Category")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl md:text-5xl font-black tracking-tighter",
						children: str(catCopy, "heading", "Find Your Fit")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "hidden md:flex items-center gap-1 text-sm font-medium hover:text-accent",
						children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
					children: displayCategories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { category: c.id },
						className: "group relative overflow-hidden rounded-2xl bg-muted aspect-[3/4]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.imageUrl ?? categoryFallbackImages[i % categoryFallbackImages.length],
								alt: c.name,
								loading: "lazy",
								className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-0 left-0 right-0 p-6 text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs opacity-70 uppercase tracking-wider",
									children: [c.count, " products"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display text-3xl font-black mt-1 flex items-center gap-2",
									children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-6 w-6 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" })]
								})]
							})
						]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-muted/40 py-20 border-y border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between mb-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
								children: str(prodCopy, "eyebrow", "Best Sellers")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-4xl md:text-5xl font-black tracking-tighter",
								children: str(prodCopy, "heading", "Trending Now")
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden md:flex gap-2",
								children: [
									{
										label: "All",
										to: "/",
										search: void 0
									},
									{
										label: "Men",
										to: "/shop",
										search: { gender: "men" }
									},
									{
										label: "Women",
										to: "/shop",
										search: { gender: "women" }
									},
									{
										label: "Kids",
										to: "/shop",
										search: { gender: "kids" }
									}
								].map((t) => t.label === "All" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setProductFilter("All"),
									className: `px-4 py-2 rounded-full text-sm font-medium ${productFilter === "All" ? "bg-primary text-primary-foreground" : "bg-background border border-border hover:border-accent"}`,
									children: "All"
								}, t.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: t.to,
									search: t.search,
									className: "px-4 py-2 rounded-full text-sm font-medium bg-background border border-border hover:border-accent",
									children: t.label
								}, t.label))
							})]
						}),
						isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-6 text-sm text-amber-600",
							children: [
								"Backend offline — showing demo catalog. Start the API with",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-xs",
									children: "npm run start:dev"
								}),
								" in",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-xs",
									children: "backend/"
								}),
								"."
							]
						}),
						usingApi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-6 text-sm text-emerald-600",
							children: [
								"Live inventory connected · ",
								displayProducts.length,
								" products from API"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
							children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square rounded-2xl mb-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-2/3 mb-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/3" })
							] }, i)) : filteredProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group flex flex-col justify-between h-full bg-card/60 rounded-2xl p-3 border border-border/60 hover:border-accent transition-all shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative overflow-hidden rounded-xl bg-background aspect-square mb-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/products/$id",
											params: { id: p.id },
											className: "block h-full w-full",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
												src: p.img,
												alt: p.name,
												loading: "lazy",
												width: 800,
												height: 800,
												className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											})
										}),
										p.tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `absolute top-3 left-3 z-10 max-w-[calc(100%-3.5rem)] truncate rounded-full px-3 ${p.tag.startsWith("-") ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`,
											children: p.tag
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistButton, {
											product: p,
											className: "absolute top-3 right-3 z-10"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: addItem.isPending,
											onClick: (e) => {
												e.preventDefault();
												e.stopPropagation();
												handleQuickAdd(p, e);
											},
											className: "absolute bottom-3 left-3 right-3 z-10 h-9 sm:h-10 px-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-accent disabled:opacity-50",
											children: t("quickAdd")
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products/$id",
									params: { id: p.id },
									className: "block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground uppercase tracking-wider truncate",
													children: p.brand
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-semibold mt-1 line-clamp-1",
													children: p.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1 mt-1 text-xs text-muted-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-accent text-accent" }),
														" ",
														p.rating,
														" (",
														p.reviewCount,
														")"
													]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shrink-0 text-right ml-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold",
												children: formatMoney(p.price, { round: true })
											}), p.oldPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground line-through",
												children: formatMoney(p.oldPrice, { round: true })
											})]
										})]
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1.5 mt-2",
									children: p.colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-3.5 w-3.5 rounded-full border border-border",
										style: { background: c }
									}, i))
								})]
							}, p.id))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-4 py-20 grid lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					search: { category: "running" },
					className: "relative overflow-hidden rounded-3xl aspect-[4/5] lg:aspect-auto lg:min-h-[500px] group block cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: lifestyle_running_default,
							alt: "Run",
							loading: "lazy",
							className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-0 p-8 md:p-12 text-white space-y-4 max-w-md z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-accent text-accent-foreground rounded-full",
									children: str(splitLeft, "badge", "Performance")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-4xl md:text-5xl font-black leading-tight",
									children: str(splitLeft, "heading", "Built for Every Mile.")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-white/70",
									children: str(splitLeft, "body", "Discover our running collection engineered with responsive foam and breathable knit uppers.")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center justify-center rounded-full h-10 px-6 bg-accent text-accent-foreground font-medium text-sm group-hover:bg-accent/90 transition",
									children: t("shopRunning")
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					search: { category: "lifestyle" },
					className: "relative overflow-hidden rounded-3xl aspect-[4/5] lg:aspect-auto lg:min-h-[500px] group block cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: lifestyle_lace_default,
							alt: "Style",
							loading: "lazy",
							className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-0 p-8 md:p-12 text-white space-y-4 max-w-md z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-white text-black rounded-full",
									children: str(splitRight, "badge", "Lifestyle")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-4xl md:text-5xl font-black leading-tight",
									children: str(splitRight, "heading", "Everyday Elevated.")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-white/70",
									children: str(splitRight, "body", "Timeless silhouettes crafted from premium materials for the modern wardrobe.")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center justify-center rounded-full h-10 px-6 bg-white text-black font-medium text-sm group-hover:bg-white/90 transition",
									children: t("shopLifestyle")
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative overflow-hidden bg-primary text-primary-foreground py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-8 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { onSale: "true" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-accent text-accent-foreground rounded-full mb-4 hover:opacity-90 cursor-pointer",
								children: "Flash Sale"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-5xl md:text-6xl font-black tracking-tighter mb-4",
							children: str(flash, "heading", "Up to 50% Off Ends Tonight.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-white/60 mb-6",
							children: "Premium performance footwear at unbeatable prices. Limited stock available."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashSaleCountdown, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { onSale: "true" },
								children: "Shop Sale"
							})
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { onSale: "true" },
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-accent/30 blur-3xl rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: shoe_3_default,
							alt: "Sale",
							loading: "lazy",
							className: "relative rounded-3xl"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-4 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-accent font-semibold mb-2",
						children: str(testimonials, "eyebrow", "Customer Voices")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl md:text-5xl font-black tracking-tighter",
						children: str(testimonials, "heading", "Real Reviews")
					})]
				}), reviewsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-3 gap-6",
					children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" }, i))
				}) : featuredReviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-muted-foreground",
					children: "No reviews yet — be the first on a product page."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-3 gap-6",
					children: featuredReviews.map((r) => {
						const cardClassName = "bg-card border border-border rounded-2xl p-6 hover:shadow-elegant transition-shadow block";
						const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5 mb-3",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${i < r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"}` }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm leading-relaxed mb-4",
								children: [
									"“",
									r.comment || r.title || "Great product.",
									"”"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-4 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-sm",
									children: r.authorName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: r.productName || "Verified Buyer"
								})] })]
							})
						] });
						return r.productId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/products/$id",
							params: { id: r.productId },
							className: `${cardClassName} cursor-pointer`,
							children: body
						}, r.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cardClassName,
							children: body
						}, r.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-muted/40 border-y border-border py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl px-4 text-center space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl md:text-5xl font-black tracking-tighter",
							children: str(newsletter, "heading", typeof cmsSettings?.newsletterHeading === "string" && cmsSettings.newsletterHeading || t("joinClub"))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground max-w-lg mx-auto",
							children: str(newsletter, "subtext", typeof cmsSettings?.newsletterSubtext === "string" && cmsSettings.newsletterSubtext || "Get 10% off your first order plus early access to drops, exclusive offers, and product launches.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterSubscription, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No spam. Unsubscribe anytime."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Home as component };
