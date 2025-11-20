import { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BudgetWithCurrent } from "@/types";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import BudgetCardContent from "./BudgetCardContent";
import BudgetComponentHeader from "./BudgetComponentHeader";

type BudgetCardProps = {
  budget: BudgetWithCurrent;
  progress: {
    spent: number;
    percentage: number;
  };
  onDelete: (budget: BudgetWithCurrent) => void;
};

const BudgetCard = ({
  budget,
  progress,
  onDelete,
}: BudgetCardProps): ReactElement => {
  const t = useTranslations("budget_list");
  return (
    <div className="relative group">
      <Link href={`/budget/${budget.id}`} className="block">
        <Card className="cursor-pointer hover:shadow-md shadow-sm border-none transition-shadow">
          <BudgetComponentHeader budget={budget} progress={progress} />

          <BudgetCardContent budget={budget} progress={progress} t={t} />
        </Card>
      </Link>

      {/* Delete Button - positioned absolutely over the card */}
      <Button
        size="icon"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(budget);
        }}
        className="absolute bottom-1 shadow-none right-2 text-gray-500 hover:text-destructive"
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};
export default BudgetCard;
