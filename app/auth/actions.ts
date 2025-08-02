"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PlanTiers } from "@/utils/stripe/plans";
import { UserMetadata } from "@/utils/supabase/users";

// Will return the credits used by the anonymous session and destroy the acct
async function handleAnonymousSession() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (user.data.user && user.data.user.is_anonymous) {
        await supabase.auth.admin.deleteUser(user.data.user.id);
        return (user.data.user.user_metadata as UserMetadata).usage || 0;
    }
    return 0;
}

export async function login(formData: FormData) {
    const supabase = await createClient();

    await handleAnonymousSession();

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    });

    if (error && error.code === "email_not_confirmed")
        redirect("/auth/login?error=email_verification");
    else if (error) redirect("/auth/login?error=any");

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();
    const creditsUsed = await handleAnonymousSession();
    const { error } = await supabase.auth.signUp({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                nickname: formData.get("nickname") as string,
                planType: PlanTiers.Free,
                usageLastReset: Date.now(),
                usage: creditsUsed,
            },
        },
    });

    if (error) redirect("/auth/signup?error=true");

    revalidatePath("/", "layout");
    redirect("/auth/signup/email_verification");
}
