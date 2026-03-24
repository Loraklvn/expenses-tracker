"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchCategoriesClient,
  fetchExpensesTemplateClient,
} from "@/lib/supabase/request/client";
import { Category, ExpenseTemplate } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export type UnbudgetedTransactionMode = "template" | "category";

export type AddUnbudgetedTransactionFormValues = {
  mode: UnbudgetedTransactionMode;
  templateId: string;
  categoryId: string;
  amount: string;
  description: string;
  transactionDate: string;
};

type AddUnbudgetedTransactionModalProps = {
  visible: boolean;
  isSubmitting: boolean;
  onSubmit: (values: AddUnbudgetedTransactionFormValues) => void;
  onClose: () => void;
};

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = (): AddUnbudgetedTransactionFormValues => ({
  mode: "template",
  templateId: "",
  categoryId: "",
  amount: "",
  description: "",
  transactionDate: today(),
});

const AddUnbudgetedTransactionModal = ({
  visible,
  isSubmitting,
  onSubmit,
  onClose,
}: AddUnbudgetedTransactionModalProps) => {
  const t = useTranslations("transactions");
  const [form, setForm] =
    useState<AddUnbudgetedTransactionFormValues>(emptyForm());

  const { data: templates = [] } = useQuery<ExpenseTemplate[]>({
    queryKey: ["expense-templates-for-unbudgeted"],
    queryFn: fetchExpensesTemplateClient,
    enabled: visible,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories-for-unbudgeted"],
    queryFn: () => fetchCategoriesClient({ type: "expense", archived: false }),
    enabled: visible,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (visible) setForm(emptyForm());
  }, [visible]);

  const onChange = (
    field: keyof AddUnbudgetedTransactionFormValues,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setMode = (mode: UnbudgetedTransactionMode) => {
    setForm((prev) => ({ ...prev, mode, templateId: "", categoryId: "" }));
  };

  const isValid =
    !!form.amount &&
    Number(form.amount) > 0 &&
    !!form.transactionDate &&
    (form.mode === "template" ? !!form.templateId : !!form.categoryId);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(form);
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("add_unbudgeted_transaction")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("add_unbudgeted_transaction_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Mode toggle */}
          <div className="flex rounded-xl border border-border/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("template")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                form.mode === "template"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {t("by_template")}
            </button>
            <button
              type="button"
              onClick={() => setMode("category")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                form.mode === "category"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {t("by_category")}
            </button>
          </div>

          {/* Template or Category selector */}
          {form.mode === "template" ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("by_template")} *
              </Label>
              {templates.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("no_templates_available")}
                </p>
              ) : (
                <Select
                  value={form.templateId}
                  onValueChange={(val) => onChange("templateId", val)}
                >
                  <SelectTrigger className="w-full rounded-xl border-border/50">
                    <SelectValue placeholder={t("select_template")} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((tpl) => (
                      <SelectItem key={tpl.id} value={tpl.id.toString()}>
                        {tpl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("by_category")} *
              </Label>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("no_categories_available")}
                </p>
              ) : (
                <Select
                  value={form.categoryId}
                  onValueChange={(val) => onChange("categoryId", val)}
                >
                  <SelectTrigger className="w-full rounded-xl border-border/50">
                    <SelectValue
                      placeholder={t("select_category_placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="unbudgeted-amount" className="text-sm font-medium">
              {t("amount")} *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="unbudgeted-amount"
                type="tel"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => onChange("amount", e.target.value)}
                className="pl-10 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="unbudgeted-description"
              className="text-sm font-medium"
            >
              {t("description")} (optional)
            </Label>
            <Input
              id="unbudgeted-description"
              placeholder={t("description_placeholder")}
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="unbudgeted-date" className="text-sm font-medium">
              {t("date")} *
            </Label>
            <Input
              id="unbudgeted-date"
              type="date"
              value={form.transactionDate}
              onChange={(e) => onChange("transactionDate", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full rounded-xl h-11 px-6 font-semibold shadow-sm"
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? t("adding") : t("save_transaction")}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-sm">
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnbudgetedTransactionModal;
