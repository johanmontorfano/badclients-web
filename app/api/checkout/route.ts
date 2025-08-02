import { origin } from "@/utils/origin";
import { stripe } from "@/utils/stripe/client";
import { planPrices, PlanTiers } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Creates and redirects to a Stripe Checkout from a plan ID that must be
// in PlanTiers.
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    const url = new URL(req.url);
    const planID = parseInt(url.searchParams.get("planID")!);
    const currency = url.searchParams.get("curr");

    if (user.data.user === null)
        return NextResponse.redirect(
            `/auth/login?next=billing&planID=${planID}&curr=${currency}`,
        );

    if (!currency)
        return NextResponse.json({ error: "Currency missing" }, { status: 400 });
    if (isNaN(planID) || planID < 1 || planID > 2)
        return NextResponse.json({ error: "Bad plan price" }, { status: 400 });

    const planPrice = planPrices[planID as PlanTiers];

    try {
        const checkout = await stripe.checkout.sessions.create({
            success_url: origin + "/auth/profile?billing=ok",
            customer_email: user.data.user.email!,
            customer: user.data.user.user_metadata.customerID,
            currency,
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

        return NextResponse.json({ url: checkout.url! }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(err, { status: 500 });
    }
}
