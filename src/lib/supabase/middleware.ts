import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

const publicRoutes = ["/auth", "/", "/privacy", "/terms"];
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check. You can remove this once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !publicRoutes.includes(request.nextUrl.pathname) &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const budgetId = request.cookies.get("budgetId")?.value;
  const pathname = request.nextUrl.pathname;
  const hasVisited = request.cookies.get("hasVisited")?.value === "true";
  const SESSION_DURATION = 5 * 60; // 5 minutes in seconds

  // If user hasn't visited yet (first visit in session)
  if (!hasVisited) {
    // Set the hasVisited cookie to true
    supabaseResponse.cookies.set("hasVisited", "true", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
    });

    // If on home page and has budgetId, redirect to budget
    if (budgetId && pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = `/budget/${budgetId}`;

      return NextResponse.redirect(url);
    }
  } else {
    // Refresh cookie on any navigation (extends the session)
    supabaseResponse.cookies.set("hasVisited", "true", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
    });
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
