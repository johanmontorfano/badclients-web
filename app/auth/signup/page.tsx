import { BackButton } from "@/components/auth/back_button";
import Link from "next/link";
import { signup } from "../actions";

export default async function SignupPage(props: {
    searchParams: Promise<{ error: boolean }>;
}) {
    const params = await props.searchParams;

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <div className="text-2xl font-bold text-base-content mb-2">
                    Bad Clients
                </div>
                <h1 className="text-lg text-base-content/80">
                    Sign up for Bad Clients
                </h1>
                {!params.error ? null : (
                    <p className="text-red-400">Account creation failed</p>
                )}
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-6">
                    <form className="space-y-4">
                        <div className="form-control">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Nickname
                                </span>
                            </label>
                            <input
                                name="nickname"
                                placeholder="Enter your nickname"
                                className="input input-bordered w-full focus:input-primary"
                                required
                                autoFocus
                            />
                        </div>
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
                                required
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
                                placeholder="Create a password"
                                className="input input-bordered w-full focus:input-primary"
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            formAction={signup}
                            className="btn btn-primary w-full mt-6"
                        >
                            Create account
                        </button>
                    </form>
                </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300 mt-4">
                <div className="card-body p-4 text-center">
                    <p className="text-sm text-base-content/80">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="link link-primary font-medium"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
            <BackButton />
        </div>
    );
}
