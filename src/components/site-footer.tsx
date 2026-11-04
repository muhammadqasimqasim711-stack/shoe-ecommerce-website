import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useCmsNav, useCmsSettings } from "@/hooks/use-cms";

type SocialBrand = {
  Icon: typeof Instagram;
  label: string;
  defaultUrl: string;
  className: string;
};

const SOCIAL_BRANDS: Record<string, SocialBrand> = {
  instagram: {
    Icon: Instagram,
    label: "Instagram",
    defaultUrl: "https://www.instagram.com",
    className:
      "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 border-none",
  },
  facebook: {
    Icon: Facebook,
    label: "Facebook",
    defaultUrl: "https://www.facebook.com",
    className:
      "bg-[#1877F2] text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border-none",
  },
  twitter: {
    Icon: Twitter,
    label: "Twitter",
    defaultUrl: "https://x.com",
    className:
      "bg-[#1DA1F2] text-white hover:scale-110 hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 border-none",
  },
  youtube: {
    Icon: Youtube,
    label: "YouTube",
    defaultUrl: "https://www.youtube.com",
    className:
      "bg-[#FF0000] text-white hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 border-none",
  },
};

const FALLBACK_SHOP = [
  { label: "New Arrivals", url: "/shop?sort=newest&days=30" },
  { label: "Men", url: "/shop?gender=men" },
  { label: "Women", url: "/shop?gender=women" },
  { label: "Kids", url: "/shop?gender=kids" },
  { label: "Sale", url: "/shop?onSale=true" },
];
const FALLBACK_HELP = [
  { label: "Shipping", url: "/help/shipping" },
  { label: "Returns", url: "/help/returns" },
  { label: "Size Guide", url: "/help/size-guide" },
  { label: "FAQ", url: "/help/faq" },
  { label: "Contact", url: "/help/contact" },
];
const FALLBACK_COMPANY = [
  { label: "About", url: "/company/about" },
  { label: "Careers", url: "/company/careers" },
  { label: "Press", url: "/company/press" },
  { label: "Sustainability", url: "/company/sustainability" },
  { label: "Stores", url: "/company/stores" },
];
const FALLBACK_LEGAL = [
  { label: "Privacy", url: "/legal/privacy" },
  { label: "Terms", url: "/legal/terms" },
  { label: "Cookies", url: "/legal/cookies" },
];

export function SiteFooter() {
  const { data: nav } = useCmsNav();
  const { data: settings } = useCmsSettings();
  const shop = nav?.footer_shop?.length ? nav.footer_shop : FALLBACK_SHOP;
  const help = nav?.footer_help?.length ? nav.footer_help : FALLBACK_HELP;
  const company = nav?.footer_company?.length ? nav.footer_company : FALLBACK_COMPANY;
  const legal = nav?.footer_legal?.length ? nav.footer_legal : FALLBACK_LEGAL;
  const social = settings?.social ?? {};
  const footerText =
    (typeof settings?.footerText === "string" && settings.footerText) ||
    "Premium footwear for the ones who move different. Crafted for performance, designed for life.";
  const storeName = (typeof settings?.storeName === "string" && settings.storeName) || "SOLE";

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <div className="mb-4 font-display text-3xl font-black tracking-tighter">
              {storeName}
              <span className="text-accent">.</span>
            </div>
            <p className="mb-6 max-w-xs text-sm text-white/60">{footerText}</p>
            <div className="flex gap-3">
              {Object.keys(SOCIAL_BRANDS).map((key) => {
                const brand = SOCIAL_BRANDS[key];
                const href = social[key] || social[key.toLowerCase()] || brand.defaultUrl;
                const Icon = brand.Icon;
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={brand.label}
                    title={brand.label}
                    className={`grid h-10 w-10 place-items-center rounded-full shadow-sm ${brand.className}`}
                  >
                    <Icon className="h-4 w-4 stroke-[2.2]" />
                  </a>
                );
              })}
            </div>
          </div>
          <FooterCol title="Shop" items={shop} />
          <FooterCol title="Help" items={help} />
          <FooterCol title="Company" items={company} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {legal.map((l) => (
              <a key={l.url} href={l.url} className="hover:text-accent">
                {l.label}
              </a>
            ))}
            <a href="/blog" className="hover:text-accent">
              Journal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; url: string }>;
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2 text-sm text-white/60">
        {items.map((l) => (
          <li key={`${l.label}-${l.url}`}>
            <a href={l.url} className="hover:text-accent">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
