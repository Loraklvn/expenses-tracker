"use client";

import type React from "react";

import { getSupabaseClient } from "@/lib/supabase/client";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const t = useTranslations("auth");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            display_name: name,
          },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("an_error_occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t("create_your_account")}
        </h1>
        <p className="text-muted-foreground">{t("start_planning")}</p>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-5">
        {/* Name field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("full_name")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name_placeholder")}
              required
              className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("email_address")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email_placeholder_login")}
              required
              className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("password")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("create_strong_password")}
              required
              className="w-full pl-11 pr-12 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password strength indicators */}
          {password.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    hasMinLength ? "bg-emerald-500" : "bg-muted"
                  }`}
                >
                  {hasMinLength && <Check className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-sm ${
                    hasMinLength
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("password_requirement_min_length")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    hasUppercase ? "bg-emerald-500" : "bg-muted"
                  }`}
                >
                  {hasUppercase && <Check className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-sm ${
                    hasUppercase
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("password_requirement_uppercase")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    hasNumber ? "bg-emerald-500" : "bg-muted"
                  }`}
                >
                  {hasNumber && <Check className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-sm ${
                    hasNumber
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("password_requirement_number")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            required
            className="h-4 w-4 mt-0.5 rounded border-input text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground">
            {t("agree_to_terms")}{" "}
            <Link href="/terms" className="text-emerald-600 hover:underline">
              {t("terms_of_service")}
            </Link>{" "}
            {t("and")}{" "}
            <Link href="/privacy" className="text-emerald-600 hover:underline">
              {t("privacy_policy")}
            </Link>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {t("create_account")}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("already_have_account")}{" "}
        <Link
          href="/auth/login"
          className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 font-semibold"
        >
          {t("sign_in")}
        </Link>
      </p>

      {/* Features preview */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center mb-4">
          {t("what_youll_get")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">
              {t("feature_pre_plan")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">
              {t("feature_track_expenses")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">
              {t("feature_templates")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">
              {t("feature_income")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
