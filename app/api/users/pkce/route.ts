import { origin } from "@/utils/origin";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/** This route is used to verify an OTP code for a PKCE flow. It must feature:
 * - A `next` param
 * - A `code` param
 * - A `token_hash` param
 **/

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const url = new URL(req.url);

    const token_hash = url.searchParams.get("token_hash");
    const next = url.searchParams.get("next");

    if (!token_hash || !next) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Here is were we verify the token_hash so that our users
    // will later be able to update their password.
    const {
        data: { session },
        error,
    } = await supabase.auth.verifyOtp({ token_hash, type: "email" });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Redirect to the specified URL which in our case is
    // the app/password-reset/page.tsx, where users will set the new password
    // after they have been authenticated using the verifyOtp method
    return NextResponse.redirect(next);
}
