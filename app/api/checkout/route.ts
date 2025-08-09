import { origin } from "@/utils/origin";
import { stripe } from "@/utils/stripe/client";
import { planPrices, PlanTiers } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Creates and redirects to a Stripe Checkout from a plan ID that must be
// in PlanTiers.
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    const url = new URL(req.url);
    const planID = parseInt(url.searchParams.get("planID")!);
    const currency = url.searchParams.get("curr") || "usd";

    if (user.data.user === null)
        return NextResponse.redirect(
            `${origin}/auth/login?next=billing&planID=${planID}&curr=${currency}`,
        );

    if (isNaN(planID) || planID < 1 || planID > 2)
        return NextResponse.json({ error: "Bad plan price" }, { status: 400 });

    const priceIndex =
        planID === PlanTiers.Lifetime ? (currency === "EUR" ? 0 : 1) : 0;
    // Since we cannot specify a currency when setting up a checkout session
    // for a one-time payment, we specify prices in an array. If the price is
    // for a subscription, [0] is the only value used in the price.
    // If the price is for a payment, [0] is for EUR, and [1] is for USD
    const planPrice = planPrices[planID as PlanTiers][priceIndex];

    try {
        const checkout = await stripe.checkout.sessions.create({
            success_url: origin + "/auth/profile?billing=ok",
            customer_email:
                user.data.user.user_metadata.customerID === undefined
                    ? user.data.user.email!
                    : undefined,
            customer: user.data.user.user_metadata.customerID,
            currency: currency.toLowerCase(),
            metadata: {
                supabase_user_id: user.data.user.id,
            },
            line_items: [
                {
                    price: planPrice,
                    quantity: 1,
                },
            ],
            mode: planID === PlanTiers.Hunter ? "subscription" : "payment",
        });

        return NextResponse.redirect(checkout.url!);
    } catch (err) {
        console.log(err);
        return NextResponse.redirect(`${origin}/pricing`);
    }
}
