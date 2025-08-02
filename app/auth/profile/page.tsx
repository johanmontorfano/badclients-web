import {
    BsCreditCard2Front,
    BsFillPersonXFill,
    BsFillTrashFill,
    BsGearWideConnected,
    BsKey,
    BsQuestionCircle,
    BsX,
} from "react-icons/bs";
import { BackButton } from "@/components/auth/back_button";
import { PlanTiers } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const supabase = await createClient();
    const userPayload = await supabase.auth.getUser();

    if (userPayload.data.user === null) redirect("/auth/login");

    const user = userPayload.data.user;

    function getPlanDisplayName(planType: PlanTiers) {
        switch (planType) {
            case PlanTiers.Lifetime:
                return "Lifetime";
            case PlanTiers.Hunter:
                return "Hunter";
            default:
                return "Free";
        }
    }

    return (
        <div className="flex grow bg-base-200">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-base-content">
                            Profile
                        </h1>
                        <p className="text-base-content/60 mt-2 text-lg">
                            Your Bad Clients account information
                        </p>
                    </div>
                    <BackButton />
                </div>
                <div className="bg-base-100 rounded-lg p-8 mb-8 border border-base-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                                Email Address
                            </h3>
                            <p className="text-base-content text-lg">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                                Display Name
                            </h3>
                            <p className="text-base-content text-lg">
                                {user.user_metadata.nickname}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                                Current Plan
                            </h3>
                            <p className="text-base-content text-lg">
                                {getPlanDisplayName(
                                    user.user_metadata.planType,
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-base-100 rounded-lg p-8 border border-base-300">
                    <h3 className="text-xl font-semibold text-base-content mb-6">
                        Account Actions
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button className="btn btn-outline justify-start h-auto py-4">
                            <div className="flex items-center">
                                <BsKey size={24} />
                                <div className="text-left ml-4">
                                    <div className="font-medium">
                                        Change Password
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        Update your account password
                                    </div>
                                </div>
                            </div>
                        </button>
                        <a
                            href={user.user_metadata.planType === PlanTiers.Free ? "/pricing" : "/api/customer_portal"}
                            className={`btn btn-outline justify-start h-auto py-4 ${user.user_metadata.planType === PlanTiers.Lifetime ? "btn-disabled" : ""}`}
                        >
                            <div className="flex items-center">
                                <BsCreditCard2Front size={24} />
                                <div className="text-left ml-4">
                                    <div className="font-medium">
                                        Manage Plan
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        Check subscriptions and plans
                                    </div>
                                </div>
                            </div>
                        </a>
                        <a
                            href="/docs"
                            className="btn btn-outline justify-start h-auto py-4"
                        >
                            <div className="flex items-center">
                                <BsQuestionCircle size={24} />
                                <div className="text-left ml-4">
                                    <div className="font-medium">
                                        Help & Support
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        Get help with your account
                                    </div>
                                </div>
                            </div>
                        </a>
                        <a
                            href="/auth/signout"
                            className="btn btn-outline justify-start h-auto py-4"
                        >
                            <div className="flex items-center">
                                <BsFillPersonXFill size={24} />
                                <div className="text-left ml-4">
                                    <div className="font-medium">Sign Out</div>
                                    <div className="text-sm text-base-content/60">
                                        Sign out of your account
                                    </div>
                                </div>
                            </div>
                        </a>
                        <button className="btn btn-error btn-outline justify-start h-auto py-4">
                            <div className="flex items-center">
                                <BsFillTrashFill size={24} />
                                <div className="text-left ml-4">
                                    <div className="font-medium">
                                        Delete Account
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        Permanently delete account
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
