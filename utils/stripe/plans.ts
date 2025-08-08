export enum PlanTiers {
    Free,
    Hunter,
    Lifetime,
}

// Since we cannot specify a currency when setting up a checkout session
// for a one-time payment, we specify prices in an array. If the price is
// for a subscription, [0] is the only value used in the price.
// If the price is for a payment, [0] is for EUR, and [1] is for USD
export const planPrices: Record<PlanTiers, Array<string>> = {
    [PlanTiers.Free]: ["FREE"],
    [PlanTiers.Hunter]: [process.env.STRIPE_PLAN_PRICE_HUNTER!],
    [PlanTiers.Lifetime]: [
        process.env.STRIPE_PLAN_PRICE_LIFETIME_EUR!,
        process.env.STRIPE_PLAN_PRICE_LIFETIME_USD!
    ],
};

export const planUsage: Record<
    PlanTiers,
    {
        usage: number;
        timeRange: "day" | "month";
        extensionKeys: number;
    }
> = {
    [PlanTiers.Free]: {
        usage: 3,
        extensionKeys: 1,
        timeRange: "day",
    },
    [PlanTiers.Hunter]: {
        usage: 500,
        extensionKeys: 3,
        timeRange: "month",
    },
    [PlanTiers.Lifetime]: {
        usage: 1000,
        extensionKeys: 3,
        timeRange: "month",
    },
};

// Determines if a plan usage should be resetted based on last usage
export function planRequiresReset(planType: PlanTiers, lastReset: number) {
    const plan = planUsage[planType];
    const diff = Date.now() - lastReset;

    if (plan.timeRange === "day" && diff >= 86400 * 1000) return true;
    if (plan.timeRange === "month" && diff >= 86400 * 1000 * 30) return true;
    return false;
}
