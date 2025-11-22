"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import Searchbar from "@/components/common/Searchbar";
import useManageCategories from "@/hooks/useManageCategories";
import { Category } from "@/types";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CategoriesList from "../CategoriesList/CategoriesList";
import CategoryFormModal from "../CategoryFormModal/CategoryFormModal";

type CategoriesShellProps = {
  defaultCategories: Category[];
};

const emptyFormData = {
  id: 0,
  name: "",
  description: "",
  color: "#6b7280", // Default gray color
  type: "expense" as "expense" | "income",
};

export default function CategoriesShell({
  defaultCategories,
}: CategoriesShellProps) {
  const t = useTranslations("categories");

  // Use a single hook for all categories
  const { categories, add, edit, archive } = useManageCategories({
    defaultCategories,
  });

  const [formData, setFormData] = useState(emptyFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
  const [categoryToArchive, setCategoryToArchive] = useState<Category | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  const resetStates = () => {
    setFormVisible(false);
    setFormData(emptyFormData);

    setIsEditing(false);
    setCategoryToArchive(null);
    setIsConfirmingArchive(false);
  };

  const handleSubmit = async () => {
    if (isEditing)
      await edit.mutateAsync({
        categoryId: formData.id,
        updates: formData,
      });
    else await add.mutateAsync(formData);
    resetStates();
  };

  const confirmArchive = (category: Category) => {
    setCategoryToArchive(category);
    setIsConfirmingArchive(true);
  };

  const handleArchive = async () => {
    if (!categoryToArchive) return;
    await archive.mutateAsync(categoryToArchive.id);
    resetStates();
  };

  const openEditDialog = (category: Category) => {
    setFormData(category);
    setIsEditing(true);
    setFormVisible(true);
  };

  const openAddDialog = () => {
    setFormData(emptyFormData);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    resetStates();
  };

  const filteredCategories = (categories || []).filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter by active tab
  const tabFilteredCategories = filteredCategories.filter(
    (category) => category.type === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
        </div>

        <div className="p-4 space-y-4">
          <Searchbar
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            placeholder={t("search_placeholder")}
          />

          {/* Segmented Control */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab("expense")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === "expense"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowUpCircleIcon
                className={`h-4 w-4 ${
                  activeTab === "expense"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              />
              {t("expenses")}
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === "income"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowDownCircleIcon
                className={`h-4 w-4 ${
                  activeTab === "income"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              />
              {t("incomes")}
            </button>
          </div>

          {/* Categories List */}
          <CategoriesList
            categories={tabFilteredCategories}
            searchTerm={searchTerm}
            onAddCategory={openAddDialog}
            onEditCategory={openEditDialog}
            onArchiveCategory={confirmArchive}
            onClearSearch={() => setSearchTerm("")}
          />

          {(categories || []).length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {t("total_categories", { count: (categories || []).length })}
            </div>
          )}
        </div>

        {/* Add Category Dialog */}
        <CategoryFormModal
          visible={formVisible}
          formData={formData}
          isEditing={isEditing}
          onChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />

        {/* Archive Confirmation Dialog */}
        <ConfirmationModal
          visible={isConfirmingArchive}
          title={t("archive_category") + " " + `"${categoryToArchive?.name}"`}
          description={t("archive_category_confirmation")}
          confirmButtonText={t("archive")}
          cancelButtonText={t("cancel")}
          onClose={() => setIsConfirmingArchive(false)}
          onConfirm={handleArchive}
        />
      </div>
    </div>
  );
}
