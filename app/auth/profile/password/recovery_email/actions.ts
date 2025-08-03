"use server";

import { origin } from "@/utils/origin";
import { createClient } from "@/utils/supabase/server";

export async function sendEmailReset(state: any, form: FormData) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(
            form.get("email") as string
        );

        return { status: error ? error.code : "ok" };
    } catch (error) {
        return { status: error ? JSON.stringify(error) : "ok" };
    }
}
