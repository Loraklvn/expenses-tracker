import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorksSection() {
  const t = useTranslations("landing.how_it_works");

  const steps = [
    {
      step: "01",
      title: t("step_1.title"),
      description: t("step_1.description"),
      highlights: [
        t("step_1.highlights.multiple_sources"),
        t("step_1.highlights.custom_categories"),
        t("step_1.highlights.monthly_totals"),
      ],
    },
    {
      step: "02",
      title: t("step_2.title"),
      description: t("step_2.description"),
      highlights: [
        t("step_2.highlights.expense_templates"),
        t("step_2.highlights.category_organization"),
        t("step_2.highlights.flexible_planning"),
      ],
    },
    {
      step: "03",
      title: t("step_3.title"),
      description: t("step_3.description"),
      highlights: [
        t("step_3.highlights.real_time_tracking"),
        t("step_3.highlights.budget_vs_actual"),
        t("step_3.highlights.spending_alerts"),
      ],
    },
    {
      step: "04",
      title: t("step_4.title"),
      description: t("step_4.description"),
      highlights: [
        t("step_4.highlights.visual_reports"),
        t("step_4.highlights.trend_analysis"),
        t("step_4.highlights.smart_suggestions"),
      ],
    },
  ];
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-stone-200" />
              )}

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white text-xl font-bold mb-4 relative z-10">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-stone-500 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-2 text-sm text-stone-500"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

