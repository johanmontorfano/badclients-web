"use client";

import { JobAnalysisErrors } from "@/components/job_analysis/data";
import { JobAnalysis } from "@/components/job_analysis/job_analysis";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const params = useSearchParams();

    const [input, setInput] = useState(params.get("home_input_content") || "");
    const [errorCode, setErrorCode] = useState("");
    const [analysis, setAnalysis] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params.has("home_input_content")) {
            analyzeJobPost();
            router.replace("/app");
        }
    }, []);

    // TODO: Error handling
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

        setAnalysis(JSON.parse(data.flags));
        setLoading(false);
    }

    return (
            <div className="grow flex flex-col items-center justify-center p-8">
                {errorCode !== "" && (
                    <div className="alert alert-error mb-4">
                        <span className="text-sm">{errorCode}</span>
                    </div>
                )}
                {analysis.length > 0 ? <JobAnalysis flags={analysis} /> : null}
                <div className="join">
                    <input
                        className="input input-bordered w-[600px] mb-4 join-item"
                        placeholder="Paste the freelance job post here..."
                        value={input}
                        disabled={loading}
                        onChange={(e) => {
                            setErrorCode("");
                            setInput(e.target.value);
                        }}
                    />
                    <button
                        className="btn btn-primary mb-6 join-item"
                        onClick={analyzeJobPost}
                        disabled={input.trim().length < 20 || loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner" />
                        ) : (
                            "Analyze"
                        )}
                    </button>
                </div>
            </div>
    );
}
