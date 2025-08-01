"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();

    return (
        <div className="text-center mt-6">
            <button
                onClick={() => router.back()}
                className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content"
            >
                ← Back
            </button>
        </div>
    );
}
