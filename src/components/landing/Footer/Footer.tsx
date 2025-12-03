import Link from "next/link";
import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("landing.footer");
  return (
    <footer className="border-t border-stone-200 bg-stone-100/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-stone-900">
              {t("brand_name")}
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="#features"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              {t("features")}
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              {t("how_it_works")}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              {t("testimonials")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              {t("terms")}
            </Link>
          </nav>

          <p className="text-sm text-stone-500">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}

