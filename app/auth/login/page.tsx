import Link from "next/link";
import { BackButton } from "@/components/auth/back_button";
import { login } from "../actions";

export default async function LoginPage(props: {
    searchParams: Promise<{ error: string }>;
}) {
    const params = await props.searchParams;

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <div className="text-2xl font-bold text-base-content mb-2">
                    Bad Clients
                </div>
                <h1 className="text-lg text-base-content/80">
                    Log in to Bad Clients
                </h1>
                {!params.error ? null : params.error ===
                  "email_verification" ? (
                    <p className="text-red-400">
                        Verify your e-mail address first
                    </p>
                ) : params.error === "email_ok" ? (
                    <p className="text-green-400">E-mail verified!</p>
                ) : (
                    <p className="text-red-400">Invalid credentials</p>
                )}
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-6">
                    <form className="space-y-4">
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
                                required
                            />
                            <label className="label pt-1">
                                <Link
                                    href="/auth/profile/password?type=forgot"
                                    className="label-text-alt text-xs link link-primary"
                                >
                                    Forgot password?
                                </Link>
                            </label>
                        </div>

                        <button
                            formAction={login}
                            className="btn btn-primary w-full mt-6"
                        >
                            Log in
                        </button>
                    </form>
                </div>
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-300 mt-4">
                <div className="card-body p-4 text-center">
                    <p className="text-sm text-base-content/80">
                        New to Bad Clients?{" "}
                        <a
                            href="/auth/signup"
                            className="link link-primary font-medium"
                        >
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
            <BackButton />
        </div>
    );
}
