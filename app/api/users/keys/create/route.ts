import { PlanTiers, planUsage } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

// Creating a key is only allowed by the logged-in user and for the logged-in
// user.
// HACK: RLS policy only allows insertion from the service role, so there is
// no risk of over-creation when exposing the client Supabase credentials.
export async function POST() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || data.user === null)
        return NextResponse.json(
            { error: "no user logged in" },
            { status: 403 },
        );

    const { data: keys, error: kerror } = await supabase
        .from("extension_keys")
        .select()
        .eq("user_id", data.user.id);

    if (kerror)
        return NextResponse.json(
            { error: "database query error" },
            { status: 500 },
        );
    if (
        keys.length >=
        planUsage[data.user.user_metadata.planType as PlanTiers].extensionKeys
    )
        return NextResponse.json(
            { error: "too many keys registered" },
            { status: 403 },
        );

    const key = v4();

    const { error: ierror } = await supabase.from("extension_keys").insert({
        key,
        user_id: data.user.id,
        usage: 0,
    });


    if (ierror)
        return NextResponse.json(
            {
                error: "database insert error",
            },
            { status: 500 },
        );
    return NextResponse.json({ key });
}
