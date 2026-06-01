"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/numbers";
import { TemplateVsNonTemplateData } from "@/lib/supabase/request/client";

type TemplateVsNonTemplateCardProps = {
  data: TemplateVsNonTemplateData | null;
  isLoading?: boolean;
};

export default function TemplateVsNonTemplateCard({
  data,
  isLoading = false,
}: TemplateVsNonTemplateCardProps) {
  const t = useTranslations("analytics");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("template_vs_non_template")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const templateAvg = Number(data?.template_avg ?? 0);
  const nonTemplateAvg = Number(data?.non_template_avg ?? 0);
  const templateMonthCount = Number(data?.template_month_count ?? 0);
  const nonTemplateMonthCount = Number(data?.non_template_month_count ?? 0);
  const hasData = templateMonthCount > 0 || nonTemplateMonthCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("template_vs_non_template")}</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            {t("no_data")}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("from_template")}
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {formatCurrency(templateAvg)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("across_months", { count: templateMonthCount })}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("non_template")}
                </p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {formatCurrency(nonTemplateAvg)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("across_months", { count: nonTemplateMonthCount })}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
