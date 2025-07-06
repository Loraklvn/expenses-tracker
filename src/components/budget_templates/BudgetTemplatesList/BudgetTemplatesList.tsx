import { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { BudgetTemplateWithStats } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { formatDateToReadable } from "@/utils/date";

type BudgetTemplatesListProps = {
  budgetTemplates: BudgetTemplateWithStats[];
  onEdit: (template: BudgetTemplateWithStats) => void;
  onDuplicate: (template: BudgetTemplateWithStats) => void;
  onDelete: (template: BudgetTemplateWithStats) => void;
  onCreate: () => void;
};

const BudgetTemplatesList = ({
  budgetTemplates,
  onEdit,
  onDuplicate,
  onDelete,
  onCreate,
}: BudgetTemplatesListProps): ReactElement => {
  return (
    <div className="space-y-4">
      {budgetTemplates.length > 0 ? (
        budgetTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>
                <Badge variant="secondary">
                  {formatCurrency(template.total_default_amount)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDateToReadable(template.created_at)}</span>
                <span>•</span>
                <span>Used {template.expense_count} times</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">
                    {template.expense_count} expenses included
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(template)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDuplicate(template)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(template)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No budget templates yet</p>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      )}
    </div>
  );
};
export default BudgetTemplatesList;
