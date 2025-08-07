"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { origin } from "@/utils/origin";

// validate email addresses for new users
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    // If the extension param is present, it means that we aim at connecting
    // the extension here.
    const extension = searchParams.get("extension");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });

        if (!error && !extension)
            return NextResponse.redirect(
                origin + "/auth/profile?error=email_ok",
            );
    }
    return NextResponse.redirect(origin + "/error");
}
