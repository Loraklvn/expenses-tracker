import CustomPopover from "@/components/common/CustomPopover";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

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

  const renderCategoryItem = (category: Category) => (
    <div
      key={category.id}
      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-12 h-12 rounded-lg flex-shrink-0 shadow-sm"
          style={{ backgroundColor: category.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{category.name}</p>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {category.description}
            </p>
          )}
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
              onClick={() => onEditCategory(category)}
              className="justify-start rounded-lg"
            >
              <SquarePenIcon className="h-4 w-4 mr-2" />
              {t("edit_category")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchiveCategory(category)}
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
      {categories.length > 0 ? (
        <div className="space-y-2">{categories.map(renderCategoryItem)}</div>
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
            {t("no_categories")}
          </p>
          <Button
            onClick={onAddCategory}
            className="rounded-xl h-11 px-6 font-semibold"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("add_your_first_category")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default CategoriesList;
