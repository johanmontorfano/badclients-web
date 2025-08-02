"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { handleChangePassword, OperationType, sendEmailReset } from "./actions";
import { BackButton } from "@/components/auth/back_button";

const PAGE_INFOS = {
    reset: ["Set new password", "Enter your new password below"],
    change: ["Change password", "Update your account password"],
};

export default function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const supabase = createClient();

    const [mode, setMode] = useState<OperationType | "loading">("loading");
    const [state, action, pending] = useActionState(
        handleChangePassword.bind(null, mode),
        { status: "" },
    );
    const [email, setEmail] = useState("");

    // determine operation mode based on URL params or user auth state
    async function determineOperationMode() {
        const type = params.get("type");
        const {
            data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (currentUser) {
            setMode(type === "recovery" ? "reset" : "change");
            setEmail(currentUser.email || "");
        } else router.push("/auth/profile/password/recovery_email");
    }

    useEffect(() => {
        determineOperationMode();
    }, []);

    useEffect(() => {
        // if the operation suceeded, we redirect
        if (state.status === "ok")
            setTimeout(() => router.push("/auth/profile"), 1000);
    }, [state]);

    if (mode === "loading") {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-2xl font-bold text-base-content mb-2">
                        Bad Clients
                    </div>
                    <h1 className="text-lg text-base-content/80">
                        {PAGE_INFOS[mode][0]}
                    </h1>
                    <p className="text-sm text-base-content/60 mt-2">
                        {PAGE_INFOS[mode][1]}
                    </p>
                </div>
                <div className="bg-base-100 rounded-md shadow-lg border border-base-300 p-4 mb-4">
                    {state.status === "ok" && (
                        <div className="alert alert-success mb-4">
                            <span className="text-sm">Password changed!</span>
                        </div>
                    )}
                    {state.status !== "" && state.status !== "ok" && (
                        <div className="alert alert-error mb-4">
                            <span className="text-sm">{state.status}</span>
                        </div>
                    )}
                    {mode === "change" && (
                        <form action={action} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Email address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input input-bordered bg-base-200 w-full"
                                    value={email}
                                    disabled
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Current password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Enter current password"
                                    className="input input-bordered w-full focus:input-primary"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        New password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    className="input input-bordered w-full focus:input-primary"
                                    minLength={8}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Confirm new password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    className="input input-bordered w-full focus:input-primary"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${pending ? "loading" : ""}`}
                                disabled={pending}
                            >
                                {pending ? null : "Update password"}
                            </button>
                        </form>
                    )}
                    {mode === "reset" && (
                        <form action={action} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Email address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input input-bordered bg-base-200 w-full"
                                    value={email}
                                    disabled
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        New password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    className="input input-bordered w-full focus:input-primary"
                                    required
                                    minLength={8}
                                    autoFocus
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Confirm new password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    className="input input-bordered w-full focus:input-primary"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${pending ? "loading" : ""}`}
                                disabled={pending}
                            >
                                {pending ? null : "Set new password"}
                            </button>
                        </form>
                    )}
                </div>
                <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-4 mb-4">
                    <div className="text-center text-sm text-base-content/80">
                        {mode === "change" && (
                            <>
                                Forgot your current password?{" "}
                                <a
                                    href="/auth/profile/password/recovery_email"
                                    className="link link-primary font-medium"
                                >
                                    Reset via email
                                </a>
                            </>
                        )}
                        {mode === "reset" && (
                            <>
                                Go back to{" "}
                                <a
                                    href="/auth/login"
                                    className="link link-primary font-medium"
                                >
                                    Log in
                                </a>
                            </>
                        )}
                    </div>
                </div>
                <BackButton />
            </div>
        </div>
    );
}
