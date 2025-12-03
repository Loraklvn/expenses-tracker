import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import BudgetPreviewCard from "../BudgetPreviewCard";

export default function HeroSection() {
  const t = useTranslations("landing.hero");
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Sparkles className="h-4 w-4" />
              <span>{t("badge")}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 text-balance">
              {t("title")}
            </h1>

            <p className="text-lg md:text-xl text-stone-500 max-w-xl mx-auto lg:mx-0 text-pretty">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                {t("get_started")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-transparent px-6 py-3 text-base font-medium text-stone-700 hover:bg-stone-100 transition-colors"
              >
                {t("log_in_account")}
              </Link>
            </div>

            <p className="text-sm text-stone-500">
              {t("disclaimer")}
            </p>
          </div>

          {/* Right Content - Preview Card */}
          <div className="flex justify-center lg:justify-end">
            <BudgetPreviewCard />
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 h-96 w-96 rounded-full bg-emerald-600/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl" />
      </div>
    </section>
  );
}

