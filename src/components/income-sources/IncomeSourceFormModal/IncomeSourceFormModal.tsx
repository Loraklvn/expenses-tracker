import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { fetchCategoriesClient } from "@/lib/supabase/request/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type IncomeSourceFormModalProps = {
  visible: boolean;
  formData: {
    id: number;
    name: string;
    description: string;
    category_id: number;
  };
  isEditing: boolean;
  onChange: (field: string, value: string | number) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const IncomeSourceFormModal = ({
  visible,
  formData,
  isEditing,
  onChange,
  onClose,
  onSubmit,
}: IncomeSourceFormModalProps) => {
  const t = useTranslations("income_sources");

  const { data: categories = [] } = useQuery({
    queryKey: ["income-categories"],
    queryFn: () => fetchCategoriesClient({ type: "income" }),
  });

  const isFormValid = formData.name.trim() && formData.category_id > 0;

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("edit_income_source") : t("add_income_source")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income-source-name">
              {t("income_source_name")} *
            </Label>
            <Input
              id="income-source-name"
              placeholder={t("income_source_name_placeholder")}
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income-source-description">
              {t("description")}
            </Label>
            <Textarea
              id="income-source-description"
              placeholder={t("description_placeholder")}
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income-source-category">{t("category")} *</Label>
            <Select
              value={formData.category_id.toString()}
              onValueChange={(value) =>
                onChange("category_id", parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("select_category")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t("cancel")}
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!isFormValid}
              className="flex-1"
            >
              {t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomeSourceFormModal;
