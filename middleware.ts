import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { origin } from "@/utils/origin";

function withSupabaseCookies(response: NextResponse, cookiesToSet: any[]) {
    cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
    });
    return response;
}

export async function middleware(req: NextRequest) {
    const headers = new Headers(req.headers);
    let cookies: any[] = [];

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet: any) {
                    cookiesToSet.forEach(({ name, value, options }: any) => {
                        req.cookies.set(name, value);
                    });
                    cookies = cookiesToSet;
                },
            },
        },
    );
    const currentURL = new URL(req.url);
    const user = await supabase.auth.getUser();

    const loggedIn = user.data.user !== null;
    const anon = loggedIn ? user.data.user!.is_anonymous : false;

    // Visitor wants to send a prompt: redirected to anonymous sign-in then app
    if (
        !loggedIn &&
        req.nextUrl.pathname === "/app" &&
        currentURL.pathname !== "/api/users/anon"
    )
        return withSupabaseCookies(
            NextResponse.redirect(
                origin + "/api/users/anon?next=" + origin + "/app",
                { headers },
            ),
            cookies,
        );
    // Anonymous user wants to go to authenticated pages other than /app:
    // redirected to /auth/signup
    if (
        loggedIn &&
        anon &&
        req.nextUrl.pathname.startsWith("/auth") &&
        req.nextUrl.pathname !== "/auth/signup" &&
        req.nextUrl.pathname !== "/auth/login"
    )
        return withSupabaseCookies(
            NextResponse.redirect(origin + "/auth/signup", { headers }),
            cookies,
        );

    // Logged in user goes to authentication pages: redirect to profile page
    if (
        loggedIn &&
        !anon &&
        (req.nextUrl.pathname === "/auth/login" ||
            req.nextUrl.pathname === "/auth/signup")
    )
        return withSupabaseCookies(
            NextResponse.redirect(origin + "/auth/profile", { headers }),
            cookies,
        );

    // If we are on a server action, headers are not edited by the middleware.
    if (req.headers.get("next-action") !== null)
        return withSupabaseCookies(
            NextResponse.next({ request: req }),
            cookies,
        );
    return withSupabaseCookies(
        NextResponse.next({ request: req, headers }),
        cookies,
    );
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
