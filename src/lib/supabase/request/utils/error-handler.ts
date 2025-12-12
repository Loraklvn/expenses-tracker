import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Custom error class for Supabase request errors
 * Provides more context and better error messages
 */
export class SupabaseRequestError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string,
    public hint?: string
  ) {
    super(message);
    this.name = "SupabaseRequestError";
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupabaseRequestError);
    }
  }
}

/**
 * Handles Supabase errors consistently across all request functions
 * Converts PostgrestError to a more user-friendly SupabaseRequestError
 *
 * @param error - The error from Supabase (PostgrestError or Error)
 * @param context - Additional context about what operation failed
 * @throws {SupabaseRequestError} Always throws a SupabaseRequestError
 *
 * @example
 * ```typescript
 * const { data, error } = await supabase.from('table').select();
 * if (error) handleSupabaseError(error, 'fetching items');
 * ```
 */
export function handleSupabaseError(error: unknown, context?: string): never {
  // If it's already our custom error, just re-throw it
  if (error instanceof SupabaseRequestError) {
    throw error;
  }

  // Handle PostgrestError from Supabase
  if (error && typeof error === "object" && "message" in error) {
    const supabaseError = error as PostgrestError;
    const contextMessage = context ? ` while ${context}` : "";
    const message =
      supabaseError.message || "An unknown database error occurred";

    throw new SupabaseRequestError(
      `${message}${contextMessage}`,
      supabaseError.code,
      supabaseError.details,
      supabaseError.hint
    );
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const contextMessage = context ? ` while ${context}` : "";
    throw new SupabaseRequestError(
      `${error.message}${contextMessage}`,
      undefined,
      undefined,
      undefined
    );
  }

  // Fallback for unknown error types
  const contextMessage = context ? ` while ${context}` : "";
  throw new SupabaseRequestError(
    `An unknown error occurred${contextMessage}`,
    undefined,
    undefined,
    undefined
  );
}
