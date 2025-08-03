"use client";

import { JobAnalysisErrors } from "@/components/job_analysis/data";
import { JobAnalysis } from "@/components/job_analysis/job_analysis";
import { JobInputSection } from "@/components/job_analysis/job_input";
import { PlanTiers, planUsage } from "@/utils/stripe/plans";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const params = useSearchParams();

    const [input, setInput] = useState(params.get("home_input_content") || "");
    const [errorCode, setErrorCode] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [remaining, setRemaining] = useState(3);
    const [planTimeRange, setPlanTimeRange] = useState<"day" | "month">("day");

    useEffect(() => {
        if (params.has("home_input_content")) {
            analyzeJobPost();
            router.replace("/app");
        }

        getRemainingCredits();
    }, []);

    async function getRemainingCredits() {
        const supabase = createClient();
        const user = await supabase.auth.getUser();

        if (user.data.user) {
            const planData =
                planUsage[user.data.user.user_metadata.planType as PlanTiers];
            const usage = user.data.user.user_metadata.usage;

            setRemaining(planData.usage - usage);
            setPlanTimeRange(planData.timeRange);
        }
    }

    async function analyzeJobPost() {
        if (input.trim().length < 20) return;

        setLoading(true);
        setErrorCode("");

        const res = await fetch("/api/jobs/analysis", {
            method: "POST",
            body: JSON.stringify({ input }),
        });
        const data = await res.json();

        if (!res.ok) {
            setLoading(false);
            if (
                data.error === JobAnalysisErrors.NotEnoughCredits &&
                data.accountType === "anon"
            )
                setErrorCode(
                    "No credits remaining, create an account to continue.",
                );
            else if (
                data.error === JobAnalysisErrors.NotEnoughCredits &&
                data.accountType === "perma"
            )
                setErrorCode(
                    "No credits remaining, check your account dashboard.",
                );
            if (data.error === JobAnalysisErrors.AuthenticationFailed)
                setErrorCode("Failed to retrieve account.");
            if (data.error === JobAnalysisErrors.ContentMissing)
                setErrorCode("Request empty");
            return;
        }

        setAnalysis(typeof data.flags === "object" ? data.flags : JSON.parse(data.flags));
        setRemaining(data.remainingUsages);
        setLoading(false);
    }

    return (
        <div className="grow flex flex-col items-center justify-between p-2">
            {errorCode !== "" && (
                <div className="alert alert-error mb-4">
                    <span className="text-sm">{errorCode}</span>
                </div>
            )}
            {analysis ? (
                <div className="grow flex justify-center items-center mb-8">
                    <JobAnalysis flags={analysis} />
                </div>
            ) : null}
            <div
                className={
                    analysis
                        ? "w-full"
                        : "grow flex justify-center items-center w-full"
                }
            >
                <JobInputSection
                    input={input}
                    loading={loading}
                    requestsLeft={remaining}
                    planTimeRange={planTimeRange}
                    setInput={setInput}
                    setErrorCode={setErrorCode}
                    analyzeJobPost={analyzeJobPost}
                />
            </div>
        </div>
    );
}
