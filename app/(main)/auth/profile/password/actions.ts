"use server";

import { origin } from "@/utils/origin";
import { createClient } from "@/utils/supabase/server";

export type OperationType = "change" | "reset";

export async function sendEmailReset(state: any, form: FormData) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(
            form.get("email") as string,
            {
                redirectTo: origin + "/auth/profile/password?type=recovery",
            },
        );

        return { status: error ? error.code : "ok" };
    } catch (error) {
        return { status: error ? JSON.stringify(error) : "ok" };
    }
}

// NOTE: bind `operationType`
export async function handleChangePassword(
    type: OperationType,
    state: any,
    form: FormData,
) {
    const supabase = await createClient();
    const email = form.get("email") as string;
    const currentPassword = form.get("currentPassword") as string;
    const newPassword = form.get("newPassword") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (
        !newPassword ||
        !confirmPassword ||
        (state.type === "change" && (!email || !currentPassword))
    )
        return { status: "Invalid request parameters" };
    if (newPassword !== confirmPassword)
        return { status: "Passwords do not match" };
    if (newPassword.length < 8) return { status: "Password too short" };

    // We try to use the provided credentials to log in the user to verify those
    // are correct.
    if (type === "change") {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword,
        });

        if (error) return { status: "Current password is invalid" };
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error)
        return {
            status: `Failed to update password (code: ${error.code})`,
        };
    return { status: "ok" };
}
