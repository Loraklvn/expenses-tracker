import { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useTranslations } from "next-intl";

const colors = [
  "#f87171", // red
  "#fbbf24", // yellow
  "#34d399", // green
  "#60a5fa", // blue
  "#c084fc", // purple
  "#f472b6", // pink
  "#f97316", // orange
  "#0ea5e9", // cyan
  "#6b7280", // gray
  "#10b981", // emerald
  "#06b6d4", // cyan
];

type CategoryFormModalProps = {
  visible: boolean;
  formData: {
    name: string;
    description: string;
    color: string;
    type: "expense" | "income";
  };
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const CategoryFormModal = ({
  visible,
  formData,
  isEditing,
  onChange,
  onClose,
  onSubmit,
}: CategoryFormModalProps): ReactElement => {
  const t = useTranslations("categories");
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("edit_category") : t("add_category")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">{t("category_name")} *</Label>
            <Input
              id="category-name"
              placeholder={t("category_name_placeholder")}
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-description">{t("description")}</Label>
            <Input
              id="category-description"
              placeholder={t("description_placeholder")}
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-type">{t("type")} *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("select_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    {t("expense")}
                  </div>
                </SelectItem>
                <SelectItem value="income">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    {t("income")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("color")}</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange("color", color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full  ${
                    formData.color === color
                      ? "ring-2 ring-offset-2 ring-primary"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={!formData.name || !formData.type}
          >
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CategoryFormModal;
