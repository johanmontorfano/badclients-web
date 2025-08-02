"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { origin } from "@/utils/origin";

const PAGE_INFOS = {
    forgot: [
        "Reset your password",
        "Enter your email to receive a password reset link",
    ],
    reset: ["Set new password", "Enter your new password below"],
    change: ["Change password", "Update your account password"],
};

export default function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const supabase = createClient();

    const [mode, setMode] = useState<"forgot" | "change" | "reset" | "loading">(
        "loading",
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // determine operation mode based on URL params or user auth state
    async function determineOperationMode() {
        const type = params.get("type");

        if (type === "forgot") {
            setMode("forgot");
            return;
        }

        const {
            data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (currentUser) {
            setMode(type === "recovery" ?  "reset" : "change");
            setFormData((prev) => ({
                ...prev,
                email: currentUser.email || "",
            }));
        } else {
            setError("Failed to retrieve current user");
            setMode("forgot");
        }
    }

    useEffect(() => {
        determineOperationMode();
    }, [params, supabase.auth]);

    function handleInputChange(ev: any) {
        setFormData({
            ...formData,
            [ev.target!.name]: ev.target!.value,
        });
        if (error) setError("");
        if (message) setMessage("");
    }

    async function handleForgotPassword(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                formData.email,
                {
                    redirectTo: origin + "/auth/profile/password?type=recovery",
                },
            );

            if (error) throw error;
            setMessage(
                "Password reset email sent! Check your inbox and follow the link to reset your password.",
            );
        } catch (err) {
            setError("Failed to send password reset email");
        }
        setLoading(false);
    }

    async function handleChangePassword(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords don't match");
            setLoading(false);
            return;
        }
        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        try {
            if (mode === "change") {
                const { error: signInError } =
                    await supabase.auth.signInWithPassword({
                        email: formData.email,
                        password: formData.currentPassword,
                    });

                if (signInError)
                    throw new Error("Current password is incorrect");
            }

            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword,
            });

            if (error) throw error;
            setFormData({
                email: "",
                newPassword: "",
                confirmPassword: "",
                currentPassword: "",
            });
            setMessage("Password updated successfully!");
            setTimeout(() => router.push("/auth/profile"), 1500);
        } catch (err) {
            setError("Failed to update password");
        }
        setLoading(false);
    }

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
                <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-6 mb-4">
                    {message && (
                        <div className="alert alert-success mb-4">
                            <span className="text-sm">{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                    {mode === "forgot" && (
                        <form
                            onSubmit={handleForgotPassword}
                            className="space-y-4"
                        >
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-sm font-medium">
                                        Email address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="input input-bordered w-full focus:input-primary"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? null : "Send reset email"}
                            </button>
                        </form>
                    )}
                    {mode === "change" && (
                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-4"
                        >
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
                                    value={formData.email}
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
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
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
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
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
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading
                                    ? "Updating password..."
                                    : "Update password"}
                            </button>
                        </form>
                    )}
                    {mode === "reset" && (
                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-4"
                        >
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
                                    value={formData.email}
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
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
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
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? null : "Set new password"}
                            </button>
                        </form>
                    )}
                </div>
                {mode !== "forgot" ? (
                    <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-4 mb-4">
                        <div className="text-center text-sm text-base-content/80">
                            {mode === "change" && (
                                <>
                                    Forgot your current password?{" "}
                                    <a
                                        href="/auth/profile/password?type=forgot"
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
                ) : null}
                <div className="text-center">
                    <button
                        onClick={() =>
                            mode === "reset"
                                ? router.push("/auth/login")
                                : router.back()
                        }
                        className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content"
                    >
                        ← Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
