"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  const switchLanguage = async () => {
    const newLocale = locale === "en" ? "es" : "en";

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;

    // Refresh the app to apply the new locale
    router.refresh();
  };

  return (
    <button onClick={switchLanguage}>
      {locale === "en" ? "🇬🇧 English" : "🇪🇸 Español"}
    </button>
  );
}
