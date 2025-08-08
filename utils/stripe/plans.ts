export enum PlanTiers {
    Free,
    Hunter,
    Lifetime,
}

export const planPrices: Record<PlanTiers, string> = {
    [PlanTiers.Free]: "FREE",
    [PlanTiers.Hunter]: process.env.STRIPE_PLAN_PRICE_HUNTER!,
    [PlanTiers.Lifetime]: process.env.STRIPE_PLAN_PRICE_LIFETIME!,
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
