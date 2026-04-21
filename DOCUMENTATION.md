# Spendiee — Full Technical Documentation

> **Audience:** LLMs and human developers who need a complete understanding of the application's features, data model, and codebase structure. Read this before making any changes.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Database Schema & Relationships](#3-database-schema--relationships)
4. [Database Views & RPC Functions](#4-database-views--rpc-functions)
5. [Feature Reference](#5-feature-reference)
   - [Authentication](#51-authentication)
   - [Categories](#52-categories)
   - [Expense Templates](#53-expense-templates)
   - [Budget Management](#54-budget-management)
   - [Budget Templates](#55-budget-templates)
   - [Transactions (Budgeted)](#56-transactions-budgeted)
   - [Transactions (Unbudgeted)](#57-transactions-unbudgeted)
   - [Income Sources](#58-income-sources)
   - [Income Transactions](#59-income-transactions)
   - [Analytics](#510-analytics)
6. [Codebase Architecture](#6-codebase-architecture)
7. [Data Flow Patterns](#7-data-flow-patterns)
8. [State Management](#8-state-management)
9. [Internationalization](#9-internationalization)
10. [Security Model](#10-security-model)

---

## 1. Project Overview

**Spendiee** is a personal finance PWA that focuses on *pre-planned* budgeting. The core philosophy is:

1. **Plan** — Create expense templates and budget templates.
2. **Budget** — Instantiate a budget for a time period, populating it with expenses.
3. **Track** — Record real transactions against those planned expenses.
4. **Analyze** — Review spending via analytics and charts.

Unbudgeted expenses (spending outside a budget) are also supported by linking a transaction directly to an expense template or a category.

Live: [https://spendiee.vercel.app](https://spendiee.vercel.app)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, server components + client components) |
| Language | TypeScript 5 |
| UI | React 19, shadcn/ui (Radix UI), Tailwind CSS 3 |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| Server state | TanStack Query v5 |
| PWA | Serwist (service worker) |
| i18n | next-intl (EN + ES, default ES) |
| Charts | Recharts |
| Notifications | react-toastify |
| Date utils | date-fns |

---

## 3. Database Schema & Relationships

### 3.1 Tables

#### `category`
Shared lookup table for both income and expense classification.

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| name | varchar | |
| description | varchar | optional |
| color | text | hex color, default `#6b7280` |
| type | `category_type` enum | `'income'` or `'expense'` |
| archived | boolean | soft delete, default false |
| user_id | uuid FK → auth.users | RLS scoped |

#### `expense_template`
A reusable, named expense definition (e.g., "Rent", "Netflix"). Not tied to any specific budget.

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| name | text | |
| description | text | optional |
| default_amount | numeric | suggested amount when adding to a budget |
| category_id | integer FK → category | |
| archived | boolean | soft delete |
| user_id | uuid FK → auth.users | |

#### `budget`
A budget covering a specific date range with a planned total spend.

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| name | varchar | e.g. "March 2024" |
| expected_amount | numeric | total planned budget |
| start_date | date | inclusive |
| end_date | date | inclusive |
| user_id | uuid FK → auth.users | |

#### `budget_expense`
An expense line inside a budget. It is either derived from an `expense_template` (with `template_id` set) or is a fully custom one-off expense (`template_id` is NULL and `name` is set directly).

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| budget_id | integer FK → budget | parent budget |
| template_id | integer FK → expense_template | NULL for custom expenses |
| name | text | used when `template_id` is NULL |
| description | text | optional |
| category_id | integer FK → category | always required |
| budgeted_amount | numeric | amount allocated for this expense |
| fixed | boolean | fixed vs variable; default true |

#### `budget_template`
A saved collection of expense templates, used to quickly populate a new budget.

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| name | text | |
| description | text | optional |
| user_id | uuid FK → auth.users | |

#### `budget_template_item`
Join table linking a `budget_template` to its constituent `expense_template` entries.

| Column | Type | Notes |
|---|---|---|
| budget_template_id | integer FK → budget_template | composite PK |
| expense_template_id | integer FK → expense_template | composite PK |

#### `income_source`
A named origin of income (e.g., "Main Job", "Freelance").

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| name | varchar | |
| description | text | optional |
| category_id | integer FK → category | optional; income-type category |
| active | boolean | default true (no hard deletes) |
| user_id | uuid FK → auth.users | |

#### `transaction`
**Central fact table.** Every financial event (income or expense) is stored here. The four nullable foreign keys are mutually exclusive based on the transaction type — see the rules below.

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| amount | numeric | always positive |
| type | `transaction_type` enum | `'expense'` or `'income'` |
| transaction_date | date | defaults to today |
| description | varchar | optional free text |
| expense_id | integer FK → budget_expense | set for **budgeted expenses** |
| template_id | integer FK → expense_template | set for **unbudgeted expenses via template** |
| category_id | integer FK → category | set for **unbudgeted expenses via category** |
| income_source_id | integer FK → income_source | set for **income transactions** |

### 3.2 Transaction Discriminator Rules

The four FK columns are mutually exclusive. The following patterns identify each transaction sub-type:

| Sub-type | `type` | `expense_id` | `template_id` | `category_id` | `income_source_id` |
|---|---|---|---|---|---|
| Budgeted expense | `expense` | ✅ set | NULL | NULL | NULL |
| Unbudgeted (template) | `expense` | NULL | ✅ set | NULL | NULL |
| Unbudgeted (category) | `expense` | NULL | NULL | ✅ set | NULL |
| Income | `income` | NULL | NULL | NULL | ✅ set |

### 3.3 Entity Relationship Diagram (logical)

```
auth.users
  │
  ├── category (type: income | expense)
  │     ├── expense_template ──────────────────────────────────────────┐
  │     │     └── budget_template_item ─── budget_template             │
  │     │                                                               │
  │     ├── budget_expense ◄── budget ◄─────────────────────────┐     │
  │     │     └── (template_id → expense_template, optional)     │     │
  │     │                                                         │     │
  │     ├── income_source                                         │     │
  │     │                                                         │     │
  │     └── transaction ─────────────────────────────────────────┘     │
  │           ├── expense_id   → budget_expense (budgeted)              │
  │           ├── template_id  → expense_template (unbudgeted+template)─┘
  │           ├── category_id  → category (unbudgeted+category)
  │           └── income_source_id → income_source (income)
```

---

## 4. Database Views & RPC Functions

The application never writes raw SQL in components. All read-optimized access goes through views and RPC functions defined in Supabase.

### 4.1 Views

#### `budgets_with_current`
Extends `budget` with `current_amount` — the sum of all transactions linked to any `budget_expense` belonging to this budget.
- Used by: `fetchBudgetsServer`, `fetchBudgetServer`, `fetchBudgetsClient`, `fetchBudgetClient`
- TypeScript type: `BudgetWithCurrent = Budget & { current_amount: number }`

#### `expenses_with_current`
Extends `budget_expense` with `current_amount` — the sum of all transactions linked to that expense.
- Used by: `fetchExpensesServer`, `fetchExpensesClient`
- TypeScript type: `ExpenseWithCurrent = Expense & { current_amount: number; template_id: number }`

#### `transactions_with_details`
Denormalized view of `transaction` joined with expense name, budget name, category info, and income source info. Powers all transaction list UIs.
- Used by: `fetchTransactionsServer`, `fetchTransactionsClient`, `fetchIncomeTransactionsClient`
- TypeScript type: `TransactionWithDetails`

```typescript
type TransactionWithDetails = Transaction & {
  expense_name: string | null;
  budget_name: string | null;
  user_id: string;
  category_name: string | null;
  category_color: string | null;
  category_type: "income" | "expense" | null;
  income_source_name: string | null;
  income_source_description: string | null;
};
```

#### `budget_templates_with_stats`
Extends `budget_template` with `expense_count`, `total_default_amount`, and `expense_template_ids[]`.
- Used by: `fetchBudgetTemplatesServer`, `fetchBudgetTemplatesClient`
- TypeScript type: `BudgetTemplateWithStats`

#### `monthly_flow_summary`
Aggregates income and spending per calendar month.
- Columns: `month_start`, `total_income`, `total_spending`
- Used by analytics (monthly chart).

#### `analytics_breakdown`
Row-level view of all transactions with enriched fields for aggregation: `type`, `transaction_date`, `amount`, `primary_category_id`, `income_source_id`, `template_id`.
- Used by `getAnalyticsBreakdown` (deprecated) and as the source for RPC functions.

### 4.2 RPC Functions

All called via `supabase.rpc(...)`. Accept optional `_start_date` and `_end_date` parameters.

| Function | Returns | Purpose |
|---|---|---|
| `get_budget_performance` | `{ average_completion_percentage, total_budgets }` | Avg spend % across budgets |
| `get_income_by_source` | `[{ income_source_id, income_source_name, total }]` | Income grouped by source |
| `get_income_by_category` | `[{ primary_category_id, total }]` | Income grouped by category |
| `get_spending_by_category` | `[{ primary_category_id, total }]` | Expenses grouped by category |
| `get_spending_by_template` | `[{ template_id, total }]` | Expenses grouped by expense template |

---

## 5. Feature Reference

### 5.1 Authentication

**What it does:** Email/password registration, login, password reset. All private routes are guarded.

**Route:** `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/update-password`

**How it works:**
- Supabase Auth handles credentials. On success, Supabase sets a session cookie.
- `src/proxy.ts` (Next.js middleware entry) delegates to `src/lib/supabase/middleware.ts`.
- The middleware reads the session cookie via the server Supabase client, and redirects unauthenticated users to `/` for any route not in the public allowlist (`/`, `/auth/*`, `/privacy`, `/terms`).
- The browser client (`src/lib/supabase/client.ts`) is a singleton created with `createBrowserClient`.
- The server client (`src/lib/supabase/server.ts`) is created per-request with `createServerClient`, reading cookies from Next.js headers.

**DB impact:** Uses `auth.users`. All other tables reference `auth.users(id)` via `user_id` and are protected by RLS policies tied to `auth.uid()`.

---

### 5.2 Categories

**What it does:** Users create color-coded categories of type `income` or `expense`. Categories are used by expense templates, income sources, budget expenses, and unbudgeted transactions. Soft-deleted via `archived = true`.

**Route:** `/categories`

**Key files:**
- `src/app/(private)/categories/page.tsx` — server page, fetches all categories
- `src/components/categories/` — shell, list, form modal
- `src/hooks/useManageCategories.ts` — add, edit, archive mutations
- `src/lib/supabase/request/client/categories.ts` — CRUD functions
- `src/lib/supabase/request/server/categories.ts` — server fetch

**Data flow:**
1. Page calls `fetchCategoriesServer()` → queries `category` table (non-archived, sorted by name).
2. Shell renders list; add/edit opens `CategoryFormModal`.
3. Mutations call `createCategoryClient`, `updateCategoryClient`, `archiveCategoryClient` → on success, `refetch()` updates TanStack Query cache.

**DB table:** `category`

---

### 5.3 Expense Templates

**What it does:** Reusable named expense definitions (e.g., "Netflix $15", "Rent $1200"). Each has a category and a default amount. Templates are selected when creating a budget or recording an unbudgeted transaction. Soft-deleted via `archived = true`.

**Route:** `/expenses` (labelled "Manage Expenses" in nav)

**Key files:**
- `src/app/(private)/expenses/page.tsx`
- `src/components/expenses/` — shell, list, form modal (`ExpenseTemplateFormModal`)
- `src/hooks/useManageExpensesTemplate.ts` — add, edit, archive mutations
- `src/lib/supabase/request/client/expense-templates.ts`
- `src/lib/supabase/request/server/expense-templates.ts`

**DB table:** `expense_template`

**Relationships:**
- `expense_template.category_id → category.id`
- Referenced by `budget_expense.template_id` (when added to a budget)
- Referenced by `budget_template_item.expense_template_id` (when included in a budget template)
- Referenced by `transaction.template_id` (for unbudgeted-via-template transactions)

---

### 5.4 Budget Management

**What it does:** Core feature. A budget has a name, date range (`start_date`/`end_date`), and `expected_amount`. Inside a budget, `budget_expense` rows define each planned expense line. Users record actual spending (transactions) against each expense to track progress.

**Routes:**
- `/` (home/dashboard) — lists all budgets with progress bars
- `/new-budget` — budget creation wizard
- `/select-template` — optional step to pick a budget template before creating
- `/budget/[budgetId]` — budget detail: expense list with spending progress

#### Creating a Budget (`/new-budget`)

1. User optionally selects a `budget_template` on `/select-template`. Its `expense_template_ids[]` are preloaded.
2. On `/new-budget`, user sets name, `expected_amount`, `start_date`, `end_date`.
3. User selects which expense templates to include (pre-selected if from template) and sets amounts for each.
4. User can also add custom one-off expenses (not from a template).
5. Submit calls `createBudgetWithLinesClient`:
   - Inserts one `budget` row.
   - For each template-based expense: inserts a `budget_expense` with `template_id` set.
   - For each custom expense: inserts a `budget_expense` with `template_id = NULL` and `name` set directly.

**Key files:**
- `src/app/(private)/new-budget/page.tsx`
- `src/components/new-budget/` — multi-step form shell
- `src/lib/supabase/request/client/budgets.ts` — `createBudgetWithLinesClient`, `fetchBudgetsClient`, `fetchBudgetClient`, `deleteBudgetClient`
- `src/lib/supabase/request/server/budgets.ts` — `fetchBudgetsServer`, `fetchBudgetServer`
- `src/hooks/useManageBudgets.tsx` — infinite query + delete mutation

#### Budget Detail (`/budget/[budgetId]`)

- Page fetches `budget` from `budgets_with_current` view and `expenses` from `expenses_with_current` view (server-side).
- `ExpensesShell` renders progress bars per expense (`current_amount / budgeted_amount`).
- Each expense has an "Add Transaction" button → opens `AddTransactionModal` → creates a budgeted transaction.
- Users can also add new expense lines to an existing budget from this page.

**Key files:**
- `src/app/(private)/budget/[budgetId]/page.tsx`
- `src/components/budget/ExpensesShell/`
- `src/hooks/useManageExpenses.ts`

**DB tables:** `budget`, `budget_expense`

---

### 5.5 Budget Templates

**What it does:** Saves a named collection of expense templates so users can reuse the same budget structure each period. Includes stats (expense count, total default amount) via the `budget_templates_with_stats` view.

**Route:** `/budget_templates`

**Key files:**
- `src/app/(private)/budget_templates/page.tsx`
- `src/components/budget_templates/` — shell, list, form modal
- `src/hooks/useManageBudgetTemplates.tsx`
- `src/lib/supabase/request/client/budget-templates.ts`
- `src/lib/supabase/request/server/budget-templates.ts`

**DB tables:** `budget_template`, `budget_template_item`

**Relationships:**
- `budget_template_item` is a join table linking templates to their expense templates.
- When applied on `/select-template`, the template's `expense_template_ids[]` array is used to preload the expense selection in the new-budget form.

---

### 5.6 Transactions (Budgeted)

**What it does:** Records actual spending against a specific `budget_expense`. This is the primary way to track whether you're staying within a budget.

**Where it appears:** Budget detail page (`/budget/[budgetId]`), via the "Add Transaction" action on each expense row.

**How it works:**
1. User taps "Add Transaction" on an expense.
2. `AddTransactionModal` opens: fields are amount, date (validated to be within budget's date range), optional description.
3. On submit: `addBudgetedTransaction(expenseId, amount, transactionDate, description)` is called.
4. This inserts into `transaction` with `expense_id = expenseId`, `type = 'expense'`.
5. The `expenses_with_current` view recalculates `current_amount` for the expense.
6. The `budgets_with_current` view recalculates `current_amount` for the budget.

**Key files:**
- `src/lib/supabase/request/client/transactions.ts` → `addBudgetedTransaction`
- `src/components/budget/ExpensesShell/` — contains the trigger
- `src/components/expenses/AddTransactionModal/` (or similar) — the form

**DB insert pattern:**
```sql
INSERT INTO transaction (expense_id, amount, description, type, transaction_date)
VALUES ($expense_id, $amount, $description, 'expense', $transaction_date);
```

---

### 5.7 Transactions (Unbudgeted)

**What it does:** Records an expense that is *not* part of any budget. Two sub-types are supported, determined by what the user links the transaction to:

- **By Template:** The expense is linked to an `expense_template` (e.g., "Netflix") without going through a budget. Useful for one-off spending that matches a known category.
- **By Category:** The expense is linked directly to a `category`. Fully freeform.

**Where it appears:** Transactions page (`/transactions`), via the "Add Expense" button at the top.

**How it works:**
1. User opens `AddUnbudgetedTransactionModal`.
2. User selects mode (By Template / By Category) via a toggle.
3. User selects the template or category from a dropdown (populated from TanStack Query, fetched only when modal is open).
4. User enters amount (required), description (optional), date (required, defaults to today).
5. Validation: amount > 0, date set, AND either templateId (mode=template) or categoryId (mode=category) selected.
6. On submit: `createUnbudgetedMutation` in `useManageTransactions` dispatches to either:
   - `addUnbudgetedTransactionWithTemplate(templateId, amount, description)` → inserts with `template_id` set
   - `addUnbudgetedTransactionWithCategory(categoryId, amount, description)` → inserts with `category_id` set

**Key files:**
- `src/components/transactions/AddUnbudgetedTransactionModal/AddUnbudgetedTransactionModal.tsx` — form modal
- `src/components/transactions/TransactionsShell/TransactionsShell.tsx` — hosts button + modal
- `src/hooks/useManageTransactions.ts` → `createUnbudgetedMutation`
- `src/lib/supabase/request/client/transactions.ts` → `addUnbudgetedTransactionWithTemplate`, `addUnbudgetedTransactionWithCategory`

**DB insert patterns:**
```sql
-- By template
INSERT INTO transaction (template_id, amount, description, type)
VALUES ($template_id, $amount, $description, 'expense');

-- By category
INSERT INTO transaction (category_id, amount, description, type)
VALUES ($category_id, $amount, $description, 'expense');
```

> Note: Unbudgeted transactions do not have a `transaction_date` column set in the current `addUnbudgetedTransactionWithTemplate` and `addUnbudgetedTransactionWithCategory` functions (they default to `CURRENT_DATE` in the DB). The UI modal collects a date but it is not forwarded — this is a known gap.

---

### 5.8 Income Sources

**What it does:** Defines named income origins (e.g., "Main Job", "Side Projects"). Each source can optionally be linked to an income-type category. Sources are referenced when recording income transactions. Soft-deleted via `active = false`.

**Route:** `/income-sources`

**Key files:**
- `src/app/(private)/income-sources/page.tsx`
- `src/components/income-sources/` — shell, list, form modal
- `src/hooks/useManageIncomeSources.ts`
- `src/lib/supabase/request/client/income-sources.ts`
- `src/lib/supabase/request/server/income-sources.ts`

**DB table:** `income_source`

---

### 5.9 Income Transactions

**What it does:** Records actual income received from a specific `income_source`. Shows a summary of this month's income total and a list of recent income transactions.

**Route:** Embedded in `/income` page (not a standalone route for the management view)

**How it works:**
1. User opens `AddIncomeModal` from the income page.
2. Fields: amount (required), income source dropdown (required), date (required, defaults to today), description (optional).
3. On submit: `createIncomeTransactionClient({ incomeSourceId, amount, description, transactionDate })`.
4. Inserts into `transaction` with `income_source_id` set, `type = 'income'`.
5. List refreshes via `useManageIncomeTransactions` → `fetchIncomeTransactionsClient`.

**Key files:**
- `src/components/income/` — `AddIncomeModal`, income shell
- `src/hooks/useManageIncomeTransactions.ts` — create, update, delete mutations
- `src/lib/supabase/request/client/transactions.ts` → `createIncomeTransactionClient`, `fetchIncomeTransactionsClient`

**DB insert:**
```sql
INSERT INTO transaction (income_source_id, amount, description, type, transaction_date)
VALUES ($income_source_id, $amount, $description, 'income', $transaction_date);
```

---

### 5.10 Analytics

**What it does:** Visual financial insights across any date range. Six charts:

| Chart | Data source |
|---|---|
| Total income / spending / net for period | `monthly_flow_summary` view, aggregated in `calculateTotalFlow` |
| Average income / spending / net per month | Same view, aggregated in `calculateAverageMonthlyFlow` (totals ÷ number of months returned) |
| Month-by-month bar chart (income vs spending) | `monthly_flow_summary` view |
| Income by source (pie) | `get_income_by_source` RPC |
| Income by category (pie) | `get_income_by_category` RPC |
| Spending by category (pie) | `get_spending_by_category` RPC |
| Spending by template (bar) | `get_spending_by_template` RPC |
| Budget performance (avg completion %) | `get_budget_performance` RPC |

**Route:** `/analytics`

**How it works:**
1. `AnalyticsShell` renders with optional date range pickers (`start_date`, `end_date`).
2. On mount and on date change, multiple TanStack Query queries run in parallel for each chart.
3. Raw IDs returned from RPC functions (category_id, template_id) are resolved to names using local `categories` and `expense_templates` arrays fetched separately.
4. Formatter functions in `src/utils/dashboard.ts` (`formatCategoryData`, `formatTemplateData`, `formatIncomeSourceData`) shape the data for Recharts.

**Key files:**
- `src/app/(private)/analytics/page.tsx`
- `src/components/analytics/AnalyticsShell/`
- `src/lib/supabase/request/client/analytics.ts` — all RPC wrappers
- `src/utils/dashboard.ts` — data formatting helpers (`calculateTotalFlow`, `calculateAverageMonthlyFlow`, …)

---

### 5.11 Transactions List Page

**What it does:** Full paginated, searchable, filterable list of all transactions (income + expenses combined). Supports edit (amount, description, date) and delete for any transaction.

**Route:** `/transactions`

**How it works:**
1. Server page calls `fetchTransactionsServer()` to get page 1 as initial data.
2. `TransactionsShell` mounts with initial data, sets up `useManageTransactions`.
3. `useQuery` with key `["transactions", page, pageSize, searchTerm, transactionType]` handles client-side re-fetches.
4. Transactions are grouped by `transaction_date` client-side in `groupTransactionsByDate`.
5. Search is debounced 500ms. Filter by type (`all`/`expense`/`income`) resets page to 1.
6. Edit: opens `EditTransactionFormModal` → `updateTransactionClient` (amount, description, date).
7. Delete: opens `ConfirmationModal` → `deleteTransactionClient`.
8. Add unbudgeted expense: opens `AddUnbudgetedTransactionModal` → `createUnbudgetedMutation`.

**Key files:**
- `src/app/(private)/transactions/page.tsx`
- `src/components/transactions/TransactionsShell/`
- `src/components/transactions/TransactionsHeader/` — search, type filter, count
- `src/components/transactions/TransactionsList/` — grouped list
- `src/components/transactions/TransactionItem/` — individual row with edit/delete
- `src/components/transactions/EditTransactionFormModal/`
- `src/components/transactions/AddUnbudgetedTransactionModal/`
- `src/hooks/useManageTransactions.ts`

---

## 6. Codebase Architecture

### Route Groups

```
src/app/
├── (landing)/          Public home/landing page
├── (private)/          Auth-required pages (layout.tsx enforces auth)
│   ├── analytics/
│   ├── budget/[budgetId]/
│   ├── budget_templates/
│   ├── categories/
│   ├── expenses/         (manage expense templates)
│   ├── income-sources/
│   ├── income/
│   ├── new-budget/
│   ├── select-template/
│   └── transactions/
└── auth/               Login, sign-up, password reset
```

### Component Pattern

Each feature follows the same structure:
```
src/components/<feature>/
├── <Feature>Shell/       "Smart" root component — owns state, hooks, handlers
├── <Feature>Header/      Search, filters, summary stats
├── <Feature>List/        Renders the list, maps items → <Feature>Item
├── <Feature>Item/        Single row with actions
├── <Feature>FormModal/   Add/Edit dialog
└── index.tsx             Re-export
```

### Data Layer

```
src/lib/supabase/
├── client.ts              Browser singleton — createBrowserClient()
├── server.ts              Per-request server client — createServerClient()
├── middleware.ts          Auth guard logic
└── request/
    ├── server/            Server Components call these (no hooks)
    │   ├── budgets.ts
    │   ├── expenses.ts
    │   ├── expense-templates.ts
    │   ├── categories.ts
    │   ├── transactions.ts
    │   ├── budget-templates.ts
    │   ├── income-sources.ts
    │   └── index.ts
    ├── client/            Client Components / hooks call these
    │   ├── budgets.ts
    │   ├── expenses.ts
    │   ├── expense-templates.ts
    │   ├── categories.ts
    │   ├── transactions.ts
    │   ├── budget-templates.ts
    │   ├── income-sources.ts
    │   ├── analytics.ts
    │   └── index.ts
    └── utils/
        └── error-handler.ts   Throws SupabaseRequestError with context
```

### Hooks

```
src/hooks/
├── useManageBudgets.tsx          infinite query + delete
├── useManageBudgetTemplates.tsx  CRUD
├── useManageCategories.ts        CRUD + archive
├── useManageExpenses.ts          add to budget + edit + delete
├── useManageExpensesTemplate.ts  CRUD + archive
├── useManageIncomeSources.ts     CRUD + archive
├── useManageIncomeTransactions.ts create + update + delete
└── useManageTransactions.ts      paginated query + create unbudgeted + update + delete
```

---

## 7. Data Flow Patterns

### Server → Client Hydration

Every page in `(private)/` follows this pattern:

```
page.tsx (Server Component)
  └── fetchXxxServer() → queries Supabase with server client
        └── <XxxShell defaultData={data} /> (Client Component)
              └── useQuery({ initialData: defaultData })
                    └── auto-refetches on filter/page/search changes
```

This gives instant first paint (no loading spinner) while enabling client-side reactivity.

### Mutation → Refetch

All mutations follow the same pattern — no optimistic updates, always server-confirmed:

```typescript
const mutation = useMutation({
  mutationFn: someClientFn,
  onSuccess: () => refetch(),      // re-run the query
  onError: () => toast.error(...),
});
```

### Error Handling

`handleSupabaseError(error, context)` in `src/lib/supabase/request/utils/error-handler.ts` throws a typed `SupabaseRequestError`. Server-side errors propagate as Next.js error boundaries. Client-side errors are caught in `onError` callbacks and shown via `react-toastify`.

---

## 8. State Management

**No global state store.** All server state is managed by TanStack Query. Local UI state (modal open/closed, form fields) is React `useState` in the shell component.

### Query Key Conventions

| Feature | Query key |
|---|---|
| Budgets list | `["budgets", filters]` |
| Single budget | derived from infinite query |
| Expenses for budget | `["expenses", budgetId]` |
| Expense templates | `["expense-templates"]` |
| Categories | `["categories"]` |
| Transactions | `["transactions", page, pageSize, searchTerm, type]` |
| Income transactions | `["income-transactions"]` |
| Income sources | `["income-sources"]` |
| Budget templates | `["budget-templates"]` |
| Analytics | separate keys per chart type |

---

## 9. Internationalization

- **Library:** next-intl
- **Locales:** `en` (English), `es` (Spanish)
- **Default:** Spanish
- **Storage:** locale stored in a cookie, persists across sessions
- **Translation files:** `messages/en.json`, `messages/es.json`
- **Namespaces:** `common`, `transactions`, `expenses`, `budget_list`, `manage_expenses`, `categories`, `income`, `income_sources`, `analytics`, `budget_templates`, `select_template`, `new_budget`, `auth`, `side_drawer`, `landing`, `privacy`, `terms`, `date`

**Usage in components:**
```typescript
const t = useTranslations("transactions");
// → t("add_expense") → "Add Expense" / "Agregar Gasto"
```

**In server components / outside React:**
```typescript
import { getTranslations } from "next-intl/server";
const t = await getTranslations("transactions");
```

---

## 10. Security Model

### Row-Level Security (RLS)

All tables have RLS enabled in Supabase. Policies scope every query to `auth.uid()`. No user can read or write another user's data — enforced at the database level regardless of application logic.

### Middleware Auth Guard

`src/proxy.ts` runs on every request. It delegates to `src/lib/supabase/middleware.ts` which:
1. Refreshes the session cookie if needed.
2. Checks if the user is authenticated.
3. Redirects unauthenticated users to `/` for any path not in the public allowlist.

**Public paths:** `/`, `/auth/*`, `/privacy`, `/terms`

### Environment Variables

Only two env vars are needed, both public (safe to expose to browser):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

The anon key is safe because RLS handles authorization. It cannot access another user's data.

---

*Last updated: 2026-03-23*
