import { ReactElement } from "react";

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
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the category details"
              : "Create a new category for organizing your expenses"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              placeholder="e.g., Transportation"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-description">Description </Label>
            <Input
              id="category-description"
              placeholder="e.g., Gas, public transport, car maintenance"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
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
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmit} disabled={!formData.name}>
            {isEditing ? "Save Changes" : "Add Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CategoryFormModal;
