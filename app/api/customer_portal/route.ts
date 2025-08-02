import { origin } from "@/utils/origin";
import { stripe } from "@/utils/stripe/client";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Creates and redirects to a Stripe Customer Portal
export async function GET() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (user.data.user === null) return NextResponse.redirect(`/auth/login`);

    const customerID = user.data.user.user_metadata.customerID;

    try {
        const portal = await stripe.billingPortal.sessions.create({
            customer: customerID,
            return_url: origin + "/auth/profile",
        });

        return NextResponse.redirect(portal.url);
    } catch (err) {
        console.log(err);

        return NextResponse.redirect(origin + "/auth/profile");
    }
}
