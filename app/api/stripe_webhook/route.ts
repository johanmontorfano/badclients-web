import { stripe } from "@/utils/stripe/client";
import { PlanTiers } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getCustomerID(
    from: string | Stripe.Customer | Stripe.DeletedCustomer,
): string {
    return typeof from === "string" ? from : from.id;
}

// Updates supabase user metadata using Admin API.
async function updateUserMetadata(
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

// Stripe webhook API endpoint
export async function POST(req: NextRequest) {
    const signature = req.headers.get("stripe-signature");

    if (signature === null)
        return NextResponse.json({ error: "No signature" }, { status: 400 });

    try {
        const body = await req.text();
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_ENDPOINT_KEY!,
        );

        console.log(`Webhook received: ${event.type}`);

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                if (!session.metadata?.supabase_user_id) {
                    console.error("No supabase_user_id in session metadata");
                    return NextResponse.json(
                        { error: "No supabase user ID" },
                        { status: 400 },
                    );
                }

                const supabaseUserId = session.metadata.supabase_user_id;
                const customerId = getCustomerID(session.customer!);

                await updateUserMetadata(supabaseUserId, {
                    customerID: customerId,
                });

                // Update Stripe customer with supabase user ID
                await stripe.customers.update(customerId, {
                    metadata: {
                        supabase_user_id: supabaseUserId,
                    },
                });

                console.log(
                    `Updated customer ${customerId} for user ${supabaseUserId}`,
                );
                return NextResponse.json({ success: true }, { status: 200 });
            }

            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                if (!paymentIntent.customer) {
                    console.error("No customer in payment intent");
                    return NextResponse.json(
                        { error: "No customer" },
                        { status: 400 },
                    );
                }

                const customer = (await stripe.customers.retrieve(
                    getCustomerID(paymentIntent.customer),
                )) as Stripe.Customer;

                // Check if customer has supabase_user_id in metadata
                let supabaseUserId = customer.metadata?.supabase_user_id;

                if (!supabaseUserId) {
                    console.log(
                        "No supabase_user_id in customer metadata, checking checkout session...",
                    );

                    // Try to find the checkout session that created this payment intent
                    const sessions = await stripe.checkout.sessions.list({
                        payment_intent: paymentIntent.id,
                        limit: 1,
                    });

                    if (
                        sessions.data.length > 0 &&
                        sessions.data[0].metadata?.supabase_user_id
                    ) {
                        supabaseUserId =
                            sessions.data[0].metadata.supabase_user_id;

                        // Update the customer with the supabase_user_id for future events
                        await stripe.customers.update(
                            getCustomerID(paymentIntent.customer),
                            {
                                metadata: {
                                    ...customer.metadata,
                                    supabase_user_id: supabaseUserId,
                                },
                            },
                        );

                        console.log(
                            `Found supabase_user_id ${supabaseUserId} from checkout session and updated customer`,
                        );
                    } else {
                        console.error(
                            "Could not find supabase_user_id in checkout session either",
                        );
                        return NextResponse.json(
                            { error: "No supabase user ID found" },
                            { status: 400 },
                        );
                    }
                }

                // Determines the kind of plan by comparing cent pricing
                // TODO: Find a better way to determine the kind of plan
                const planType =
                    paymentIntent.amount >= 5000
                        ? PlanTiers.Lifetime
                        : PlanTiers.Hunter;

                await updateUserMetadata(supabaseUserId, {
                    customerID: getCustomerID(paymentIntent.customer),
                    planType: planType,
                });
                console.log(
                    `Updated plan to ${planType} and customerID for user ${supabaseUserId}`,
                );
                return NextResponse.json({ success: true }, { status: 200 });
            }

            case "payment_intent.payment_failed":
            case "payment_intent.canceled": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                if (!paymentIntent.customer) {
                    console.error("No customer in failed payment intent");
                    return NextResponse.json(
                        { error: "No customer" },
                        { status: 400 },
                    );
                }

                const customer = (await stripe.customers.retrieve(
                    getCustomerID(paymentIntent.customer),
                )) as Stripe.Customer;

                if (!customer.metadata?.supabase_user_id) {
                    console.error("No supabase_user_id in customer metadata");
                    return NextResponse.json(
                        { error: "No supabase user ID in customer" },
                        { status: 400 },
                    );
                }

                // Set plan back to free on fail
                await updateUserMetadata(customer.metadata.supabase_user_id, {
                    planType: PlanTiers.Free,
                });

                console.log(
                    `Set plan to free for user ${customer.metadata.supabase_user_id} due to failed payment`,
                );
                return NextResponse.json({ success: true }, { status: 200 });
            }

            // Handle subscription-related events
            case "customer.subscription.created": {
                const subscription = event.data.object as Stripe.Subscription;
                const customer = (await stripe.customers.retrieve(
                    getCustomerID(subscription.customer),
                )) as Stripe.Customer;

                if (customer.metadata?.supabase_user_id) {
                    await updateUserMetadata(
                        customer.metadata.supabase_user_id,
                        {
                            planType: PlanTiers.Hunter,
                        },
                    );
                    console.log(
                        `Subscription created - set plan to Hunter for user ${customer.metadata.supabase_user_id}`,
                    );
                }
                return NextResponse.json({ success: true }, { status: 200 });
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const customer = (await stripe.customers.retrieve(
                    getCustomerID(subscription.customer),
                )) as Stripe.Customer;

                if (customer.metadata?.supabase_user_id) {
                    // Check subscription status
                    const planType =
                        subscription.status === "active"
                            ? PlanTiers.Hunter
                            : PlanTiers.Free;

                    await updateUserMetadata(
                        customer.metadata.supabase_user_id,
                        {
                            planType: planType,
                        },
                    );
                    console.log(
                        `Subscription updated - set plan to ${planType} for user ${customer.metadata.supabase_user_id}`,
                    );
                }
                return NextResponse.json({ success: true }, { status: 200 });
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customer = (await stripe.customers.retrieve(
                    getCustomerID(subscription.customer),
                )) as Stripe.Customer;

                if (customer.metadata?.supabase_user_id) {
                    await updateUserMetadata(
                        customer.metadata.supabase_user_id,
                        {
                            planType: PlanTiers.Free,
                        },
                    );
                    console.log(
                        `Subscription deleted - set plan to free for user ${customer.metadata.supabase_user_id}`,
                    );
                }
                return NextResponse.json({ success: true }, { status: 200 });
            }
            // TODO: Implement grace periods to avoid forcing users into free
            // tier directly, it does not feel user friendly.
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;

                if (invoice.customer && invoice.subscription) {
                    const customer = (await stripe.customers.retrieve(
                        getCustomerID(invoice.customer),
                    )) as Stripe.Customer;

                    if (customer.metadata?.supabase_user_id) {
                        await updateUserMetadata(
                            customer.metadata.supabase_user_id,
                            {
                                planType: PlanTiers.Free,
                            },
                        );
                        console.log(
                            `Invoice payment failed - downgraded user ${customer.metadata.supabase_user_id} to free`,
                        );
                    }
                }
                return NextResponse.json({ success: true }, { status: 200 });
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
                return NextResponse.json({ success: true }, { status: 200 });
        }
    } catch (err) {
        console.error("Webhook error:", err);
        return NextResponse.json(
            {
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 400 },
        );
    }
}
