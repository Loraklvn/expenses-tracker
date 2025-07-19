import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IncomeSource } from "@/types";
import { formatDateToReadable } from "@/utils/date";
import { Archive, Edit, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

type IncomeSourcesListProps = {
  incomeSources: IncomeSource[];
  searchTerm: string;
  onAddIncomeSource: () => void;
  onEditIncomeSource: (incomeSource: IncomeSource) => void;
  onArchiveIncomeSource: (incomeSource: IncomeSource) => void;
  onClearSearch: () => void;
};

const IncomeSourcesList = ({
  incomeSources,
  searchTerm,
  onAddIncomeSource,
  onEditIncomeSource,
  onArchiveIncomeSource,
  onClearSearch,
}: IncomeSourcesListProps) => {
  const t = useTranslations("income_sources");

  if (incomeSources.length === 0) {
    return (
      <div className="text-center py-12">
        {searchTerm ? (
          <>
            <p className="text-muted-foreground mb-4">{t("not_matching")}</p>
            <Button variant="outline" onClick={onClearSearch}>
              {t("clear_search")}
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">
              {t("no_income_sources")}
            </p>
            <Button onClick={onAddIncomeSource}>
              <Plus className="h-4 w-4 mr-2" />
              {t("add_your_first_income_source")}
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incomeSources.map((incomeSource) => (
        <Card key={incomeSource.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <h3 className="font-medium">{incomeSource.name}</h3>
                    {incomeSource.description && (
                      <p className="text-sm text-muted-foreground">
                        {incomeSource.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t("created_on", {
                        date: formatDateToReadable(incomeSource.created_at),
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditIncomeSource(incomeSource)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onArchiveIncomeSource(incomeSource)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IncomeSourcesList;
