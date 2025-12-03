import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CTASection() {
  const t = useTranslations("landing.cta");
  return (
    <section className="py-16 md:py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 md:px-12 md:py-20 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
              {t("title")}
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              {t("description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-emerald-700 hover:bg-stone-100 transition-colors"
              >
                {t("create_account")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-transparent px-6 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors"
              >
                {t("log_in")}
              </Link>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

