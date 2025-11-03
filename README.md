# 💰 Spendiee

A modern, full-featured budgeting and expense tracking Progressive Web App (PWA) built with Next.js and Supabase. Spendiee helps you manage your personal finances by tracking expenses, managing budgets, monitoring income, and organizing transactions.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🌐 Live Demo

**Try Spendiee now!** Visit the live application:

🔗 **[https://spendiee.vercel.app/](https://spendiee.vercel.app/)**

The app is fully functional and ready to use. You can sign up for a free account and start managing your budgets right away!

## ✨ Features

### 📊 Budget Management

- **Create and manage budgets** with custom date ranges and expected amounts
- **Budget templates** for quick budget creation from saved templates
- **Track spending** with real-time progress indicators
- **Budget expenses** with fixed or variable expense tracking
- **Visual budget overview** showing spent vs. remaining amounts

### 💳 Expense Tracking

- **Expense templates** for recurring expenses
- **Custom expenses** for one-time or unique expenses
- **Category-based organization** for better expense categorization
- **Transaction history** with detailed records
- **Edit and manage expenses** throughout the budget period

### 💵 Income Management

- **Income sources** tracking (salary, freelance, investments, etc.)
- **Income transactions** recording
- **Income summary** with total calculations
- **Recent income list** for quick reference

### 🏷️ Categories & Organization

- **Custom categories** with color coding
- **Category types** (income/expense) for better organization
- **Archive and manage** categories
- **Category-based filtering** and organization

### 📱 Progressive Web App

- **Offline support** with service worker
- **Installable** on mobile and desktop devices
- **Fast and responsive** user experience
- **Theme support** (light/dark mode)

### 🌍 Internationalization

- **Multi-language support** (English, Spanish)
- **Easy language switching** in the UI
- **Locale-aware formatting**

### 🔐 Authentication & Security

- **Secure authentication** with Supabase Auth
- **Password-based login** and signup
- **Password reset** functionality
- **Protected routes** with middleware
- **Row-level security** (RLS) for data protection

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Backend:** [Supabase](https://supabase.com/) (Database, Auth, Storage)
- **State Management:** [TanStack Query](https://tanstack.com/query)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **PWA:** [@ducanh2912/next-pwa](https://github.com/Ducanh2912/next-pwa)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [react-toastify](https://fkhadra.github.io/react-toastify/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project ([create one here](https://database.new))
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/expenses-tracker.git
   cd expenses-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these values in your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

4. **Set up the database**

   Run the SQL schemas in your Supabase SQL editor:

   - `income_sources_schema.sql` - Sets up income sources table
   - `transaction_rls_fix.sql` - Configures Row Level Security for transactions

   (Additional table schemas may need to be set up based on your Supabase project requirements)

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The application requires several database tables in Supabase. Make sure you have:

- `budgets` - Store budget information
- `expenses` - Track individual expenses within budgets
- `expense_templates` - Reusable expense templates
- `budget_templates` - Budget templates for quick creation
- `categories` - Expense and income categories
- `income_sources` - Income source definitions
- `transactions` - All financial transactions (income and expenses)

Ensure Row Level Security (RLS) policies are properly configured for all tables to secure user data.

## 📁 Project Structure

```
expenses-tracker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (private)/          # Protected routes
│   │   │   ├── budget/         # Budget detail pages
│   │   │   ├── budget_templates/
│   │   │   ├── categories/
│   │   │   ├── expenses/
│   │   │   ├── income-sources/
│   │   │   ├── new-budget/
│   │   │   ├── select-template/
│   │   │   └── transactions/
│   │   └── auth/               # Authentication pages
│   ├── components/             # React components
│   │   ├── auth/               # Auth components
│   │   ├── budget/             # Budget-related components
│   │   ├── categories/         # Category management
│   │   ├── common/             # Shared components
│   │   ├── expenses/           # Expense management
│   │   ├── income/             # Income components
│   │   ├── income-sources/     # Income source management
│   │   ├── transactions/       # Transaction components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   │   └── supabase/           # Supabase client/server configs
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── messages/                   # i18n translation files
│   ├── en.json
│   └── es.json
├── public/                     # Static assets
└── package.json
```

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Internationalization

Spendiee supports multiple languages out of the box:

- **English** (en) - Default
- **Spanish** (es)

To add a new language:

1. Create a new JSON file in `messages/` directory (e.g., `messages/fr.json`)
2. Copy the structure from `messages/en.json`
3. Translate all the strings
4. Update language switcher component if needed

The current locale is stored in cookies and persists across sessions.

## 🎨 Customization

### Themes

The app uses `next-themes` for theme management. Users can switch between light and dark modes via the theme switcher.

### Styling

The project uses Tailwind CSS with shadcn/ui components. To customize:

- Modify `tailwind.config.ts` for theme configuration
- Update component styles in `src/components/ui/`
- Global styles can be edited in `src/app/globals.css`

## 🚢 Deployment

### Live Version

The application is currently deployed and available at: **[https://spendiee.vercel.app/](https://spendiee.vercel.app/)**

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/expenses-tracker)

1. Click the deploy button above or push your code to GitHub
2. Import the project to Vercel
3. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Manual Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/expenses-tracker/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

If you have any questions or need help, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ for better financial management
