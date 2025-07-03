import CategoriesShell from "@/components/categories/CategoriesShell";
import { fetchCategoriesServer } from "@/lib/supabase/request/server";
import React, { ReactElement } from "react";

const CategoriesPage = async (): Promise<ReactElement> => {
  const categories = await fetchCategoriesServer();

  return <CategoriesShell defaultCategories={categories} />;
};
export default CategoriesPage;
