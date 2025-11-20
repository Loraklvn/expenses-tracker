import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import React, { ReactElement } from "react";
import { BudgetWithCurrent } from "@/types";

type BudgetComponentHeaderProps = {
  budget: BudgetWithCurrent;
  progress: {
    spent: number;
    percentage: number;
  };
};
const BudgetComponentHeader = ({
  budget,
  progress,
}: BudgetComponentHeaderProps): ReactElement => {
  return (
    <CardHeader className="p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{budget.name}</CardTitle>
        <Badge variant={progress.percentage > 100 ? "destructive" : "success"}>
          {progress.percentage.toFixed(0)}%
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="bg-blue-50 rounded-md p-1.5">
          <Calendar className="h-3 w-3" color="#2563EB" />
        </span>
        <span>
          {new Date(budget.start_date).toLocaleDateString()} -{" "}
          {new Date(budget.end_date).toLocaleDateString()}
        </span>
      </div>
    </CardHeader>
  );
};
export default BudgetComponentHeader;
