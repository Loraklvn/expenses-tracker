import {
  CalendarCheck,
  FolderTree,
  Repeat,
  Receipt,
  PiggyBank,
  BarChart3,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("landing.features");

  const features = [
    {
      icon: CalendarCheck,
      title: t("pre_plan_budget.title"),
      description: t("pre_plan_budget.description"),
    },
    {
      icon: FolderTree,
      title: t("categories_expenses.title"),
      description: t("categories_expenses.description"),
    },
    {
      icon: Repeat,
      title: t("budget_templates.title"),
      description: t("budget_templates.description"),
    },
    {
      icon: Receipt,
      title: t("transaction_tracking.title"),
      description: t("transaction_tracking.description"),
    },
    {
      icon: PiggyBank,
      title: t("income_management.title"),
      description: t("income_management.description"),
    },
    {
      icon: BarChart3,
      title: t("visual_insights.title"),
      description: t("visual_insights.description"),
    },
  ];
  return (
    <section id="features" className="py-16 md:py-24 bg-stone-100/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border border-stone-200/50 bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 mb-4">
                <feature.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-stone-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

