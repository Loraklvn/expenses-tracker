import { useTranslations } from "next-intl";
import { ReactElement } from "react";

const NewBudgetHeader = (): ReactElement => {
  const t = useTranslations("new_budget");

  return (
    <div className="flex items-center gap-3 mb-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
    </div>
  );
};
export default NewBudgetHeader;
