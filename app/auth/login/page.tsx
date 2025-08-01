"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    function handleInputChange(ev: Event) {
        setFormData({
            ...formData,
            [ev.target!.name]: ev.target!.value,
        });
    }

    async function handleSubmit(ev: SubmitEvent) {
        ev.preventDefault();
        setIsLoading(true);

        console.log("Login submitted:", formData);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <div className="text-2xl font-bold text-base-content mb-2">
                    Bad Clients
                </div>
                <h1 className="text-lg text-base-content/80">
                    Log in to Bad Clients
                </h1>
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label pb-1">
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

                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Password
                                </span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full focus:input-primary"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <label className="label pt-1">
                                <Link
                                    href="/auth/forgot-password"
                                    className="label-text-alt text-xs link link-primary"
                                >
                                    Forgot password?
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary w-full mt-6 ${isLoading ? "loading" : ""}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300 mt-4">
                <div className="card-body p-4 text-center">
                    <p className="text-sm text-base-content/80">
                        New to Bad Clients?{" "}
                        <Link
                            href="/auth/signup"
                            className="link link-primary font-medium"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={() => router.back()}
                    className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}
