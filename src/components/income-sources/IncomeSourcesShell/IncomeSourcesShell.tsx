"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import Searchbar from "@/components/common/Searchbar";
import StickyHeader from "@/components/common/StickyHeader";
import { Button } from "@/components/ui/button";
import useManageIncomeSources from "@/hooks/useManageIncomeSources";
import { IncomeSource } from "@/types";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import IncomeSourcesList from "../IncomeSourcesList/IncomeSourcesList";
import IncomeSourceFormModal from "../IncomeSourceFormModal/IncomeSourceFormModal";

type IncomeSourcesShellProps = {
  defaultIncomeSources: IncomeSource[];
};

const emptyFormData = {
  id: 0,
  name: "",
  description: "",
  category_id: 0,
};

export default function IncomeSourcesShell({
  defaultIncomeSources,
}: IncomeSourcesShellProps) {
  const t = useTranslations("income_sources");
  const { incomeSources, add, edit, archive } = useManageIncomeSources({
    defaultIncomeSources,
  });

  const [formData, setFormData] = useState(emptyFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
  const [incomeSourceToArchive, setIncomeSourceToArchive] =
    useState<IncomeSource | null>(null);

  const resetStates = () => {
    setFormVisible(false);
    setFormData(emptyFormData);
    setIsEditing(false);
    setIncomeSourceToArchive(null);
    setIsConfirmingArchive(false);
  };

  const handleSubmit = async () => {
    if (isEditing)
      await edit.mutateAsync({
        incomeSourceId: formData.id,
        updates: formData,
      });
    else
      await add.mutateAsync({
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id,
      });
    resetStates();
  };

  const confirmArchive = (incomeSource: IncomeSource) => {
    setIncomeSourceToArchive(incomeSource);
    setIsConfirmingArchive(true);
  };

  const handleArchive = async () => {
    if (!incomeSourceToArchive) return;
    await archive.mutateAsync(incomeSourceToArchive.id);
    resetStates();
  };

  const openEditDialog = (incomeSource: IncomeSource) => {
    setFormData({
      id: incomeSource.id,
      name: incomeSource.name,
      description: incomeSource.description || "",
      category_id: incomeSource.category_id || 0,
    });
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

  const filteredIncomeSources = (incomeSources || []).filter(
    (incomeSource) =>
      incomeSource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (incomeSource.description &&
        incomeSource.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <StickyHeader title={t("title")} />

        <div className="p-4 space-y-4">
          {/* Add New Income Source Button */}
          <Button
            className="w-full rounded-xl h-11 px-6 font-semibold shadow-sm"
            onClick={openAddDialog}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t("add_income_source")}
          </Button>

          {/* Search Bar */}
          <Searchbar
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            placeholder={t("search_placeholder")}
          />

          {/* Income Sources List */}
          <IncomeSourcesList
            incomeSources={filteredIncomeSources}
            searchTerm={searchTerm}
            onAddIncomeSource={openAddDialog}
            onEditIncomeSource={openEditDialog}
            onArchiveIncomeSource={confirmArchive}
            onClearSearch={() => setSearchTerm("")}
          />

          {(incomeSources || []).length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {t("total_income_sources", {
                count: (incomeSources || []).length,
              })}
            </div>
          )}
        </div>

        {/* Add Income Source Dialog */}
        <IncomeSourceFormModal
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
          title={
            t("archive_income_source") +
            " " +
            `"${incomeSourceToArchive?.name}"`
          }
          description={t("archive_income_source_confirmation")}
          confirmButtonText={t("archive")}
          cancelButtonText={t("cancel")}
          onClose={() => setIsConfirmingArchive(false)}
          onConfirm={handleArchive}
        />
      </div>
    </div>
  );
}
