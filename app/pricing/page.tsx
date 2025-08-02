import { PricingButton } from "@/components/payment/tier_button";
import { planUsage } from "@/utils/stripe/plans";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
};

const tiers = [
    {
        name: "Free",
        price: {
            "EUR": "€0",
            "USD": "$0"
        },
        description: "Perfect for light and casual usage.",
        features: ["5 requests per day", "Extension support"],
        missing: [
            "Job knowledge database access",
            "Lifetime usage",
            "Early access",
        ],
        url: "/auth/signup",
        mode: "redirect",
    },
    {
        name: "Hunter",
        price: {
            "EUR": "€5/month",
            "USD": "$5/month"
        },
        description: "Ideal for active freelancers seeking opportunities.",
        features: [
            `${planUsage[1].usage} requests per day`,
            "Extension support",
            "Job knowledge database access",
        ],
        missing: ["Lifetime usage", "Early access"],
        url: "/api/checkout?planID=1",
        mode: "call",
    },
    {
        name: "Lifetime Hunter",
        price: {
            "EUR": "€59 one-time",
            "USD": "$59 one-time"
        },
        description:
            "Everything in Hunter with lifetime access. Limited early supporter offer.",
        features: [
            `${planUsage[2].usage} requests per day`,
            "Extension support",
            "Job knowledge database access",
            "Lifetime usage",
            "Early access",
        ],
        missing: [],
        badge: "Limited Offer",
        url: "/api/checkout?planID=2",
        mode: "call",
    },
];

export default async function Page(props: { searchParams: Promise<Record<string, string>> }) {
    const params = await props.searchParams
    const currency = (params.curr || "USD") as "EUR" | "USD";

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold tracking-tight">
                    Choose Your Plan
                </h2>
                <p className="mt-4 text-lg text-base-content/70">
                    Whether you're testing or hunting for your next job, we have
                    a plan for you.
                </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3 max-lg:grid-rows-3 max-w-6xl mx-auto h-full justify-center">
                <div />
                <div />
                <div className="join justify-end">
  <a href="/pricing?curr=USD" className="btn join-item">$</a>
  <a href="/pricing?curr=EUR" className="btn join-item">€</a>
</div>
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className="card max-w-[600px] min-h-[40vh] lg:min-h-[50vh] bg-base-100 shadow-xl border border-base-300 h-full"
                    >
                        <div className="card-body flex flex-col justify-between">
                            <div>
                                <p className="mt-2 text-xl font-bold text-primary">
                                    {tier.price[currency]}
                                </p>
                                <h3 className="text-3xl font-semibold">
                                    {tier.name}
                                </h3>
                                {tier.badge ? (
                                    <div className="badge badge-xs badge-warning">
                                        {tier.badge}
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <p className="text-base text-base-content/70">
                                    {tier.description}
                                </p>
                            </div>
                            <div>
                                <ul className="space-y-2">
                                    {tier.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-success">
                                                ✓
                                            </span>{" "}
                                            {feature}
                                        </li>
                                    ))}
                                    {tier.missing.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2 opacity-50"
                                        >
                                            <span className="text-disabled">
                                                ⨯
                                            </span>{" "}
                                            <span className="line-through">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <PricingButton
                                    url={tier.url}
                                    mode={tier.mode}
                                    curr={currency}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
