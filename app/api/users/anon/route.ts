// Anonymously authenticate users if they are not already authenticated. This

import { PlanTiers } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/server";
import { UserMetadata } from "@/utils/supabase/users";
import { NextRequest, NextResponse } from "next/server";

// is important to monitor usage for unauthenticated users. If an user is
// already authenticated, this route will forward.
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const next = url.searchParams.get("next");

    if (!next)
        return NextResponse.json({ error: "`next` not specified" }, { status: 400 });

    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (user.data.user === null)
        console.log(await supabase.auth.signInAnonymously({
            options: {
                data: {
                    usageLastReset: Date.now(),
                    planType: PlanTiers.Free,
                    nickname: "anon",
                    usage: 0
                } as UserMetadata
            }
        }));
    return NextResponse.redirect(next);    
}
