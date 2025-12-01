"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  const switchLanguage = async () => {
    const newLocale = locale === "en" ? "en" : "es";

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; secure; samesite=strict`;

    // Refresh the app to apply the new locale
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLanguage}
      className="text-sm"
    >
      {locale === "en" ? "🇬🇧 EN" : "🇪🇸 ES"}
    </Button>
  );
}
