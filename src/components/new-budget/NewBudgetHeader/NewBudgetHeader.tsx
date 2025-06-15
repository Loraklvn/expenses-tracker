import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import React, { ReactElement } from "react";

const NewBudgetHeader = (): ReactElement => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="ghost" size="icon">
        <ArrowLeftIcon className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">Create Budget</h1>
    </div>
  );
};
export default NewBudgetHeader;
