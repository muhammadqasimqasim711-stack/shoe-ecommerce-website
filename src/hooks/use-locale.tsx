import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  formatMoney as formatMoneyBase,
  loadLocalePrefs,
  saveLocalePrefs,
  translate,
  type Currency,
  type Language,
  type LocalePrefs,
  type MessageKey,
} from "@/lib/locale";

type LocaleContextValue = {
  language: Language;
  currency: Currency;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  t: (key: MessageKey) => string;
  formatMoney: (amountUsd: number, opts?: { round?: boolean }) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<LocalePrefs>(DEFAULT_LOCALE);

  useEffect(() => {
    setPrefs(loadLocalePrefs());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = prefs.language;
    }
  }, [prefs.language]);

  const setLanguage = useCallback((language: Language) => {
    setPrefs((prev) => {
      const next = { ...prev, language };
      saveLocalePrefs(next);
      return next;
    });
  }, []);

  const setCurrency = useCallback((currency: Currency) => {
    setPrefs((prev) => {
      const next = { ...prev, currency };
      saveLocalePrefs(next);
      return next;
    });
  }, []);

  const t = useCallback((key: MessageKey) => translate(prefs.language, key), [prefs.language]);

  const formatMoney = useCallback(
    (amountUsd: number, opts?: { round?: boolean }) =>
      formatMoneyBase(amountUsd, prefs.currency, opts?.round ?? false),
    [prefs.currency],
  );

  const value = useMemo(
    () => ({
      language: prefs.language,
      currency: prefs.currency,
      setLanguage,
      setCurrency,
      t,
      formatMoney,
    }),
    [prefs.language, prefs.currency, setLanguage, setCurrency, t, formatMoney],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
