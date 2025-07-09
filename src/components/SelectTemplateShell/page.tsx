import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetTemplateWithStats } from "@/types";
import { FileIcon as FileTemplate, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { formatCurrency } from "@/utils/numbers";
import { getTranslations } from "next-intl/server";

const SelectTemplateShell = async ({
  budgetTemplates,
}: {
  budgetTemplates: BudgetTemplateWithStats[];
}) => {
  const t = await getTranslations("select_template");
  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">
              {t("choose_how_to_start")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("select_template_description")}
            </p>
          </div>

          {/* Start from Scratch Option */}
          <Link href="/new-budget" className="block">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {t("start_from_scratch")}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t("start_from_scratch_description")}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Template Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("or_choose_a_template")}
              </h3>
              <Link href="/budget_templates">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  {t("new_template")}
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {budgetTemplates.map((template) => (
                <Link
                  href={`/new-budget?templateId=${template.id}`}
                  className="block"
                  key={template.id}
                >
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileTemplate className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {template.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {formatCurrency(template.total_default_amount)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {t("expenses_included", {
                            count: template.expense_count,
                          })}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
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
