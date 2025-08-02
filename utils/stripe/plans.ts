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
    PlanTiers, { usage: number, timeRange: "day" | "month" }
> = {
    [PlanTiers.Free]: {
        usage: 3,
        timeRange: "day"
    },
    [PlanTiers.Hunter]: {
        usage: 500,
        timeRange: "month"
    },
    [PlanTiers.Lifetime]: {
        usage: 750,
        timeRange: "month"
    }
}
