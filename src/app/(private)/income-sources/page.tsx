import IncomeSourcesShell from "@/components/income-sources/IncomeSourcesShell/IncomeSourcesShell";
import { fetchIncomeSourcesServer } from "@/lib/supabase/request/server";
import React, { ReactElement } from "react";

const IncomeSourcesPage = async (): Promise<ReactElement> => {
  const incomeSources = await fetchIncomeSourcesServer();

  return <IncomeSourcesShell defaultIncomeSources={incomeSources} />;
};

export default IncomeSourcesPage;
