import { PlanTiers } from "../stripe/plans";
import { createClient } from "./server";

export interface UserMetadata {
    nickname: string;
    planType: PlanTiers;
    usageLastReset: number;
    usage: number;
    customerID: string;
}

// Updates supabase user metadata using Admin API.
// WARN: Secret role used
export async function updateUserMetadata(
    supabaseUserId: string,
    updates: Record<string, any>,
) {
    const supabase = await createClient();
    const { data: userData, error: getUserError } =
        await supabase.auth.admin.getUserById(supabaseUserId);

    if (getUserError || !userData.user)
        throw new Error(`Failed to get user: ${getUserError?.message}`);

    const { error: updateError } = await supabase.auth.admin.updateUserById(
        supabaseUserId,
        {
            user_metadata: {
                ...userData.user.user_metadata,
                ...updates,
            },
        },
    );

    if (updateError)
        throw new Error(
            `Failed to update user metadata: ${updateError.message}`,
        );
}
