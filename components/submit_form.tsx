"use client";

import { useFormStatus } from "react-dom";

export function SubmitForm(props: { label: string }) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending} className="btn btn-primary w-full mt-6">
            {pending ? (
                <span className="loading loading-spinner loading-sm" />
            ) : (
                props.label
            )}
        </button>
    );
}
