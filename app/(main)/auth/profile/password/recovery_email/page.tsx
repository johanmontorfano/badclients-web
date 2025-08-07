"use client";

import { BackButton } from "@/components/auth/back_button";
import { sendEmailReset } from "./actions";
import { useActionState } from "react";

export default function Page() {
    const [state, action, pending] = useActionState(sendEmailReset, {
        status: "",
    });

    return (
        <>
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="text-2xl font-bold text-base-content mb-2">
                            Bad Clients
                        </div>
                        <h1 className="text-lg text-base-content/80">
                            Reset your password
                        </h1>
                        <p className="text-sm text-base-content/60 mt-2">
                            Enter your e-mail to receive a password reset link
                        </p>
                    </div>
                    <div className="bg-base-100 rounded-sm shadow-lg border border-base-300 p-4 mb-4">
                        {state.status === "ok" && (
                            <div className="alert alert-success mb-4">
                                <span className="text-sm">
                                    Recovery email sent, check your inbox!
                                </span>
                            </div>
                        )}
                        {state.status !== "ok" && state.status !== "" && (
                            <div className="alert alert-error mb-4">
                                <span className="text-sm">
                                    Failed to send recovery email (
                                    {state.status})
                                </span>
                            </div>
                        )}
                        <form className="space-y-4" action={action}>
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
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${pending ? "loading" : ""}`}
                                disabled={pending}
                            >
                                {pending ? null : "Send reset email"}
                            </button>
                        </form>
                    </div>
                    <BackButton />
                </div>
            </div>
        </>
    );
}
