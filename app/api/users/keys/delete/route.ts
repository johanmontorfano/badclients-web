import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Deleting a key is only allowed by the logged-in user and for the logged-in
// user.
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || data.user === null)
        return NextResponse.json(
            { error: "no user logged in" },
            { status: 403 },
        );

    const body = await req.json();

    if (body.key_id === null)
        return NextResponse.json({ error: "no key specified" }, { status: 400 });

    console.log(body);

    const { error: ierror } = await supabase.from("extension_keys")
        .delete()
        .eq("id", body.key_id);

    console.log(ierror);

    if (ierror)
        return NextResponse.json(
            { error: "database delete error" },
            { status: 500 },
        );
    return NextResponse.json({}, { status: 200 });
}
