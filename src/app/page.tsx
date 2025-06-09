"use client";

import BudgetsList from "@/components/budgets/BudgetsList";
import ExpensesList from "@/components/expenses/ExpensesList/ExpensesList";
import { Budget, Expense, Transaction } from "@/types";
import { useState } from "react";

export default function BudgetTracker() {
  const [currentView, setCurrentView] = useState<"budgets" | "expenses">(
    "budgets"
  );
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const [expenses] = useState<Expense[]>([
    {
      id: 1,
      name: "Gas",
      description: "Monthly fuel expenses",
      budgeted_amount: 200,
      fixed: false,
      category_id: 1,
      budget_id: 1,
    },
    {
      id: 2,
      name: "Groceries",
      description: "Weekly grocery shopping",
      budgeted_amount: 400,
      fixed: false,
      category_id: 2,
      budget_id: 1,
    },
    {
      id: 3,
      name: "Gym Membership",
      description: "Monthly gym fee",
      budgeted_amount: 50,
      fixed: true,
      category_id: 3,
      budget_id: 1,
    },
    {
      id: 4,
      name: "Dining Out",
      description: "Restaurants and takeout",
      budgeted_amount: 150,
      fixed: false,
      category_id: 4,
      budget_id: 1,
    },
    {
      id: 5,
      name: "Public Transport",
      description: "Bus and train tickets",
      budgeted_amount: 80,
      fixed: false,
      category_id: 1,
      budget_id: 1,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      description: "Shell Gas Station",
      amount: 45.5,
      type: "expense",
      transaction_date: "2024-01-15",
      expense_id: 1,
    },
    {
      id: 2,
      description: "Walmart Groceries",
      amount: 85.2,
      type: "expense",
      transaction_date: "2024-01-16",
      expense_id: 2,
    },
    {
      id: 3,
      description: "Gym Payment",
      amount: 50.0,
      type: "expense",
      transaction_date: "2024-01-01",
      expense_id: 3,
    },
    {
      id: 4,
      description: "Pizza Delivery",
      amount: 25.0,
      type: "expense",
      transaction_date: "2024-01-17",
      expense_id: 4,
    },
  ]);

  const getCurrentSpent = (expenseId: number) => {
    return transactions
      .filter((t) => t.expense_id === expenseId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetExpenses = (budgetId: number) => {
    return expenses.filter((e) => e.budget_id === budgetId);
  };

  if (currentView === "budgets") {
    return (
      <BudgetsList
        setCurrentView={setCurrentView}
        setSelectedBudget={setSelectedBudget}
        getBudgetExpenses={getBudgetExpenses}
        getCurrentSpent={getCurrentSpent}
      />
    );
  }

  return (
    <ExpensesList
      setCurrentView={setCurrentView}
      getBudgetExpenses={getBudgetExpenses}
      getCurrentSpent={getCurrentSpent}
      transactions={transactions}
      setTransactions={setTransactions}
      selectedBudget={selectedBudget}
    />
  );
}
