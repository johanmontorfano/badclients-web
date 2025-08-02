"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// validate email addresses for new users
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;

    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = "/auth/login";
    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });

        if (!error) {
            redirectTo.searchParams.set("error", "email_ok");
            redirectTo.searchParams.delete("next");
            return NextResponse.redirect(redirectTo);
        }
    }

    redirectTo.pathname = "/error";
    return NextResponse.redirect(redirectTo);
}
