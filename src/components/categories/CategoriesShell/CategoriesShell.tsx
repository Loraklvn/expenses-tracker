"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useManageCategories from "@/hooks/useManageCategories";
import { Category } from "@/types";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import CategoriesList from "../CategoriesList/CategoriesList";
import CategoryFormModal from "../CategoryFormModal/CategoryFormModal";
import { useTranslations } from "next-intl";

type CategoriesShellProps = {
  defaultCategories: Category[];
};

const emptyFormData = {
  id: 0,
  name: "",
  description: "",
  color: "#6b7280", // Default gray color
};

export default function CategoriesShell({
  defaultCategories,
}: CategoriesShellProps) {
  const t = useTranslations("categories");
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

  const resetStates = () => {
    setFormVisible(false);
    setFormData(emptyFormData);

    setIsEditing(false);
    setCategoryToArchive(null);
    setIsConfirmingArchive(false);
  };

  const handleSubmit = async () => {
    if (isEditing)
      await edit.mutateAsync({ categoryId: formData.id, updates: formData });
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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>

        <div className="space-y-6">
          {/* Add New Category Button */}
          <Button className="w-full" size="lg" onClick={openAddDialog}>
            <PlusIcon className="h-4 w-4 mr-2" />
            {t("add_category")}
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories List */}
          <CategoriesList
            categories={filteredCategories}
            searchTerm={searchTerm}
            onAddCategory={openAddDialog}
            onEditCategory={openEditDialog}
            onArchiveCategory={confirmArchive}
            onClearSearch={() => setSearchTerm("")}
          />

          {categories.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {t("total_categories", { count: categories.length })}
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
