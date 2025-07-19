import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Category } from "@/types";
import {
  ArchiveIcon,
  EditIcon,
  PlusIcon,
  TrendingUpIcon,
  DollarSignIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactElement, useState } from "react";

type CategoriesListProps = {
  categories: Category[];
  searchTerm: string;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onArchiveCategory: (category: Category) => void;
  onClearSearch: () => void;
};

const CategoriesList = ({
  categories,
  searchTerm,
  onAddCategory,
  onEditCategory,
  onArchiveCategory,
  onClearSearch,
}: CategoriesListProps): ReactElement => {
  const t = useTranslations("categories");
  const [expandedSections, setExpandedSections] = useState({
    expense: true,
    income: true,
  });

  // Group categories by type
  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const incomeCategories = categories.filter((cat) => cat.type === "income");

  const toggleSection = (section: "expense" | "income") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderCategoryItem = (category: Category) => (
    <div
      key={category.id}
      className="flex items-center justify-between py-3 px-1 border-b border-border/50 last:border-b-0"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <p className="font-medium text-base">{category.name}</p>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("created_on", {
                date: new Date(category.created_at).toLocaleDateString(),
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEditCategory(category)}
          className="ml-2"
        >
          <EditIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onArchiveCategory(category)}
          className="ml-1 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <ArchiveIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {categories.length > 0 ? (
        <>
          {/* Expense Categories Section */}
          {expenseCategories.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <Button
                  variant="ghost"
                  className="p-0 h-auto flex items-center gap-2 w-full justify-start"
                  onClick={() => toggleSection("expense")}
                >
                  <DollarSignIcon className="h-5 w-5 text-red-600" />
                  <span className="text-lg font-semibold">
                    {t("expense_categories")}
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    ({expenseCategories.length})
                  </span>
                  {expandedSections.expense ? (
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </CardHeader>
              {expandedSections.expense && (
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {expenseCategories.map(renderCategoryItem)}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Income Categories Section */}
          {incomeCategories.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <Button
                  variant="ghost"
                  className="p-0 h-auto flex items-center gap-2 w-full justify-start"
                  onClick={() => toggleSection("income")}
                >
                  <TrendingUpIcon className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-semibold">
                    {t("income_categories")}
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    ({incomeCategories.length})
                  </span>
                  {expandedSections.income ? (
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </CardHeader>
              {expandedSections.income && (
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {incomeCategories.map(renderCategoryItem)}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </>
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
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t("no_categories")}</p>
          <Button onClick={onAddCategory}>
            <PlusIcon className="h-4 w-4 mr-2" />
            {t("add_your_first_category")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default CategoriesList;
