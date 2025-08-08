import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-base-200 text-center px-6">
            <div className="max-w-lg">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <h2 className="mt-4 text-3xl font-bold text-base-content">
                    Oops... Page Not Found
                </h2>
                <p className="mt-2 text-base text-base-content/70">
                    Looks like this page ghosted you. You can always head back
                    and find what you were looking for.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="btn btn-primary">
                        Go Home
                    </Link>
                    <Link
                        href="https://github.com/johanmontorfano/badclients-web/issue"
                        className="btn btn-outline"
                    >
                        Report an Issue
                    </Link>
                </div>
            </div>
        </main>
    );
}
