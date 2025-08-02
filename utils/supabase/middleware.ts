import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { origin } from "../origin";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: any) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    const user = await supabase.auth.getUser();

    if (
        user.data.user !== null &&
        (request.nextUrl.pathname === "/auth/login" ||
            request.nextUrl.pathname === "/auth/signup")
    )
        return NextResponse.redirect(origin + "/auth/profile");

    return supabaseResponse;
}
