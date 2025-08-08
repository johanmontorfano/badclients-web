import { BackButton } from "@/components/auth/back_button";
import { PlanTiers, planUsage } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { StatefulPart } from "@/components/auth/extension_keys/ui";

export const metadata: Metadata = {
    title: "Extension Keys",
};

// TODO: Consider adding realtime updates
export default async function Page() {
    const supabase = await createClient();
    const userPayload = await supabase.auth.getUser();

    if (userPayload.data.user === null) redirect("/auth/login");

    const user = userPayload.data.user;
    const userPlanType = user.user_metadata.planType as PlanTiers;
    const maxKeys = planUsage[userPlanType]?.extensionKeys || 0;

    // Fetch extension keys for the user
    const { data: extensionKeys, error } = await supabase
        .from("extension_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error || extensionKeys === null)
        console.error("Error fetching extension keys:", error);

    return (
        <div className="flex grow bg-base-200">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-base-content">
                            Extension Keys
                        </h1>
                        <p className="text-base-content/60 mt-2 text-lg">
                            Manage your Bad Clients extension API keys
                        </p>
                    </div>
                    <BackButton />
                </div>
                <StatefulPart
                    initialState={extensionKeys || []}
                    planType={userPlanType}
                    maxKeys={maxKeys}
                    userId={user.id}
                />
            </div>
        </div>
    );
}
