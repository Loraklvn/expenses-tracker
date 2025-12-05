"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("landing.header");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/40 bg-stone-50/95 backdrop-blur supports-[backdrop-filter]:bg-stone-50/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-stone-900">
            {t("brand_name")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            {t("features")}
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            {t("how_it_works")}
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            {t("testimonials")}
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            {t("log_in")}
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            {t("sign_up")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-stone-500 hover:text-stone-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t("close_menu") : t("open_menu")}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("features")}
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("how_it_works")}
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("testimonials")}
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-stone-200">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-transparent px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors w-full"
              >
                {t("log_in")}
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors w-full"
              >
                {t("sign_up")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
