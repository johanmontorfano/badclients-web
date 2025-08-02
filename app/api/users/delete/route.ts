import { stripe } from "@/utils/stripe/client";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
    try {
        const supabase = await createClient();

        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const userID = authUser.id;

        console.log(`Starting deletion process for user ${userID}`);

        const { data: userData, error: getUserError } =
            await supabase.auth.admin.getUserById(userID);

        if (getUserError || !userData.user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const stripeCustomerId = userData.user.user_metadata?.customerID;
        const deletionResults = {
            supabaseUser: false,
            stripeSubscriptions: false,
            stripeCustomer: false,
            errors: [] as string[],
        };

        // We cancel all Stripe subscriptions and delete the customer first
        if (stripeCustomerId) {
            try {
                console.log(
                    `Canceling subscriptions for customer ${stripeCustomerId}`,
                );

                const subscriptions = await stripe.subscriptions.list({
                    customer: stripeCustomerId,
                    status: "all",
                });

                for (const subscription of subscriptions.data) {
                    if (
                        subscription.status === "active" ||
                        subscription.status === "trialing" ||
                        subscription.status === "past_due"
                    ) {
                        await stripe.subscriptions.cancel(subscription.id, {
                            prorate: false,
                        });
                        console.log(`Canceled subscription ${subscription.id}`);
                    }
                }

                deletionResults.stripeSubscriptions = true;
                console.log(
                    `Successfully canceled all subscriptions for customer ${stripeCustomerId}`,
                );
            } catch (error) {
                const errorMsg = `Failed to cancel Stripe subscriptions: ${error instanceof Error ? error.message : "Unknown error"}`;
                console.error(errorMsg);
                deletionResults.errors.push(errorMsg);
            }

            try {
                console.log(`Deleting Stripe customer ${stripeCustomerId}`);
                await stripe.customers.del(stripeCustomerId);
                deletionResults.stripeCustomer = true;
                console.log(
                    `Successfully deleted Stripe customer ${stripeCustomerId}`,
                );
            } catch (error) {
                const errorMsg = `Failed to delete Stripe customer: ${error instanceof Error ? error.message : "Unknown error"}`;
                console.error(errorMsg);
                deletionResults.errors.push(errorMsg);
            }
        } else {
            console.log("No Stripe customer ID found, skipping Stripe");
            deletionResults.stripeSubscriptions = true;
            deletionResults.stripeCustomer = true;
        }

        // We now delete the Supabase user
        try {
            console.log(`Deleting Supabase user ${userID}`);

            const { error: deleteUserError } =
                await supabase.auth.admin.deleteUser(userID);

            if (deleteUserError) {
                throw new Error(deleteUserError.message);
            }

            deletionResults.supabaseUser = true;
            console.log(`Successfully deleted Supabase user ${userID}`);
        } catch (error) {
            const errorMsg = `Failed to delete Supabase user: ${error instanceof Error ? error.message : "Unknown error"}`;
            console.error(errorMsg);
            deletionResults.errors.push(errorMsg);
        }

        const allSuccessful =
            deletionResults.supabaseUser &&
            deletionResults.stripeSubscriptions &&
            deletionResults.stripeCustomer;

        if (allSuccessful) {
            console.log(`User deletion completed successfully for ${userID}`);
            return NextResponse.json(
                { details: deletionResults },
                { status: 200 },
            );
        } else {
            console.error(
                `Partial deletion failure for ${userID}:`,
                deletionResults,
            );
            return NextResponse.json(
                { details: deletionResults },
                { status: 207 },
            );
        }
    } catch (error) {
        console.error("Unexpected error during user deletion:", error);
        return NextResponse.json(
            {
                error: "Internal server error during deletion",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
