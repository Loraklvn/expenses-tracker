"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  archiveCategoryClient,
  createCategoryClient,
  fetchCategoriesClient,
  updateCategoryClient,
} from "@/lib/supabase/request/client";
import { Category } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
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
};

export default function CategoriesShell({
  defaultCategories,
}: CategoriesShellProps) {
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesClient,
    initialData: defaultCategories,
  });
  const { mutate: createCategory } = useMutation({
    mutationFn: createCategoryClient,
    onSuccess: () => {
      refetch();
      toast.success("Category created successfully!");
    },
  });
  const { mutate: updateCategory } = useMutation({
    mutationFn: updateCategoryClient,
    onSuccess: () => {
      refetch();
      toast.success("Category updated successfully!");
    },
  });
  const { mutate: archiveCategory } = useMutation({
    mutationFn: archiveCategoryClient,
    onSuccess: () => {
      refetch();
      toast.success("Category archived successfully!");
    },
  });

  const [formData, setFormData] = useState(emptyFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
  const [categoryToArchive, setCategoryToArchive] = useState<Category | null>(
    null
  );

  const resetForm = () => {
    setFormData(emptyFormData);
  };

  const addCategory = () => {
    createCategory(formData);
    resetForm();
    setFormVisible(false);
  };

  const editCategory = () => {
    updateCategory({ categoryId: formData.id, updates: formData });
    resetForm();
    setIsEditing(false);
    setFormVisible(false);
  };

  const handleSubmit = () => {
    if (isEditing) editCategory();
    else addCategory();
  };

  const confirmArchive = (category: Category) => {
    setCategoryToArchive(category);
    setIsConfirmingArchive(true);
  };

  const handleArchive = () => {
    if (!categoryToArchive) return;

    archiveCategory(categoryToArchive.id);

    setCategoryToArchive(null);
    setIsConfirmingArchive(false);
  };

  const openEditDialog = (category: Category) => {
    setFormData(category);
    setIsEditing(true);
    setFormVisible(true);
  };

  const openAddDialog = () => {
    resetForm();
    setFormVisible(true);
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
          <h1 className="text-2xl font-bold">Categories</h1>
        </div>

        <div className="space-y-6">
          {/* Add New Category Button */}
          <Button className="w-full" size="lg" onClick={openAddDialog}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Category
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
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
              {categories.length} total categories
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
          onClose={() => setFormVisible(false)}
          onSubmit={handleSubmit}
        />

        {/* Archive Confirmation Dialog */}
        <ConfirmationModal
          visible={isConfirmingArchive}
          title="Archive Category"
          description={`Are you sure you want to archive "${categoryToArchive?.name}"?`}
          confirmButtonText="Archive"
          cancelButtonText="Cancel"
          onClose={() => setIsConfirmingArchive(false)}
          onConfirm={handleArchive}
        />
      </div>
    </div>
  );
}
