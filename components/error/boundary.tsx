import { useEffect } from "react";
import Link from "next/link";

export function ErrorBoundaryUI({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-200 text-center px-6">
      <div className="max-w-lg">
        <h1 className="text-6xl font-bold text-error">Something Went Wrong</h1>
        <p className="mt-4 text-base-content/70">
          Looks like this page just pulled a{" "}
          <span className="font-semibold text-error">bad client</span> move.
          You can try again or head back to safety.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 p-4 bg-base-300 rounded-lg text-left overflow-auto max-h-64 text-sm">
            {error.message}
          </pre>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}

