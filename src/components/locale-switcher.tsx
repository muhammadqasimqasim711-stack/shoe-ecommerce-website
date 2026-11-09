import { useId, useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import type { Currency, Language } from "@/lib/locale";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  /** Compact text trigger for announcement bar */
  variant?: "bar" | "header";
};

export function LocaleSwitcher({ className, variant = "bar" }: LocaleSwitcherProps) {
  const { language, currency, setLanguage, setCurrency } = useLocale();
  const [open, setOpen] = useState(false);
  const baseId = useId();
  const languageSelectId = `locale-language-select-${baseId}`;
  const currencySelectId = `locale-currency-select-${baseId}`;

  const label = `${language.toUpperCase()} / ${currency}`;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "hover:text-accent transition text-left",
          variant === "header" &&
            "rounded-full border border-border px-2.5 py-1 text-xs font-medium hover:border-accent",
        )}
      >
        {label}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-border bg-background p-3 shadow-lg text-foreground"
          >
            <label htmlFor={languageSelectId} className="block text-xs text-muted-foreground mb-1">
              Language
            </label>
            <select
              id={languageSelectId}
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="mb-3 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="en">EN — English</option>
              <option value="es">ES — Español</option>
            </select>
            <label htmlFor={currencySelectId} className="block text-xs text-muted-foreground mb-1">
              Currency
            </label>
            <select
              id={currencySelectId}
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
