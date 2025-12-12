// Budgets
export {
  fetchBudgetsClient,
  fetchBudgetClient,
  createBudgetWithLinesClient,
  deleteBudgetClient,
  type FetchBudgetsClientArgs,
  type FetchBudgetsClientResult,
  type CreateBudgetArgs,
} from "./budgets";

// Expenses
export {
  fetchExpensesClient,
  addExpenseToBudgetClient,
  addCustomExpenseToBudgetClient,
  updateBudgetExpenseClient,
  deleteBudgetExpenseClient,
} from "./expenses";

// Transactions
export {
  addBudgetedTransaction,
  addUnbudgetedTransactionWithTemplate,
  addUnbudgetedTransactionWithCategory,
  addIncomeTransaction,
  addTransactionClient,
  fetchTransactionsClient,
  updateTransactionClient,
  deleteTransactionClient,
  fetchIncomeTransactionsClient,
  createIncomeTransactionClient,
  type FetchTransactionsResult,
  type FetchTransactionsArgs,
} from "./transactions";

// Expense Templates
export {
  fetchExpensesTemplateClient,
  postExpenseTemplateClient,
  updateExpenseTemplateClient,
  archiveExpenseTemplateClient,
  type PostExpenseTemplateArgs,
} from "./expense-templates";

// Categories
export {
  fetchCategoriesClient,
  createCategoryClient,
  updateCategoryClient,
  archiveCategoryClient,
} from "./categories";

// Budget Templates
export {
  createBudgetTemplateClient,
  fetchBudgetTemplatesClient,
  updateBudgetTemplateClient,
  deleteBudgetTemplateClient,
  type CreateBudgetTemplateArgs,
} from "./budget-templates";

// Income Sources
export {
  fetchIncomeSourcesClient,
  createIncomeSourceClient,
  updateIncomeSourceClient,
  archiveIncomeSourceClient,
} from "./income-sources";

// Analytics
export {
  getMonthlyFlow,
  getAnalyticsBreakdown,
  getBudgetPerformance,
  getIncomeBySource,
  getIncomeByCategory,
  getSpendingByCategory,
  getSpendingByTemplate,
  type MonthlyFlowData,
  type AnalyticsItem,
  type BudgetPerformanceData,
  type IncomeBySourceItem,
  type IncomeByCategoryItem,
  type SpendingByCategoryItem,
  type SpendingByTemplateItem,
} from "./analytics";
