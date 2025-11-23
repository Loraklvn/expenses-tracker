import CustomPopover from "@/components/common/CustomPopover";
import { Button } from "@/components/ui/button";
import { IncomeSource } from "@/types";
import { formatDateToReadable } from "@/utils/date";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
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

  const renderIncomeSourceItem = (incomeSource: IncomeSource) => (
    <div
      key={incomeSource.id}
      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-green-500 flex-shrink-0 shadow-sm" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">
            {incomeSource.name}
          </p>
          {incomeSource.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {incomeSource.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {t("created_on", {
              date: formatDateToReadable(incomeSource.created_at),
            })}
          </p>
        </div>
      </div>
      <CustomPopover
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-accent flex-shrink-0"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </Button>
        }
        content={
          <div className="flex flex-col gap-1 p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditIncomeSource(incomeSource)}
              className="justify-start rounded-lg"
            >
              <SquarePenIcon className="h-4 w-4 mr-2" />
              {t("edit_income_source")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchiveIncomeSource(incomeSource)}
              className="justify-start rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {t("archive")}
            </Button>
          </div>
        }
        contentProps={{
          className: "w-fit p-0",
        }}
      />
    </div>
  );

  return (
    <div>
      {incomeSources.length > 0 ? (
        <div className="space-y-2">
          {incomeSources.map(renderIncomeSourceItem)}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {t("not_matching")} &quot;{searchTerm}&quot;
          </p>
          <Button variant="outline" onClick={onClearSearch}>
            {t("clear_search")}
          </Button>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-6 text-base">
            {t("no_income_sources")}
          </p>
          <Button
            onClick={onAddIncomeSource}
            className="rounded-xl h-11 px-6 font-semibold"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("add_your_first_income_source")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default IncomeSourcesList;
