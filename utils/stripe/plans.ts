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
