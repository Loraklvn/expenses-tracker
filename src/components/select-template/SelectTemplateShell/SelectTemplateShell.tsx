import { Badge } from "@/components/ui/badge";
import { BudgetTemplateWithStats } from "@/types";
import { FileIcon as FileTemplate, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";
import { formatCurrency } from "@/utils/numbers";
import { getTranslations } from "next-intl/server";
import StickyHeader from "@/components/common/StickyHeader";

const SelectTemplateShell = async ({
  budgetTemplates,
}: {
  budgetTemplates: BudgetTemplateWithStats[];
}) => {
  const t = await getTranslations("select_template");
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        <StickyHeader
          title={t("choose_how_to_start")}
          description={t("select_template_description")}
        />

        <div className="p-4 space-y-4">
          {/* Start from Scratch Option */}
          <Link href="/new-budget" className="block">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold mb-1">
                  {t("start_from_scratch")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("start_from_scratch_description")}
                </p>
              </div>
            </div>
          </Link>

          {/* Template Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("or_choose_a_template")}
              </h3>
              <Link href="/budget_templates">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-9 px-3 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  {t("new_template")}
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {budgetTemplates.map((template) => (
                <Link
                  href={`/new-budget?templateId=${template.id}`}
                  className="block"
                  key={template.id}
                >
                  <div className="p-4 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileTemplate className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-semibold">
                            {template.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="flex-shrink-0 text-xs font-semibold"
                          >
                            {formatCurrency(template.total_default_amount)}
                          </Badge>
                        </div>
                        {template.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {t("expenses_included", {
                            count: template.expense_count,
                          })}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTemplateShell;
