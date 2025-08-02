"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";

const DELETION_IMPLICATIONS = [
    "All data linked to your account permanently deleteted",
    "Any ongoing subscription cancelled",
    "Loosing access to any Lifetime on-time payment",
];

export function DeleteDialog() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function openDeleteDialog() {
        document.getElementById("delete_dialog")!.showModal();
    }

    async function deleteAccount() {
        setLoading(true);

        const res = await fetch("/api/users/delete", { method: "DELETE" });
        const json = await res.json();

        if (res.ok) redirect("/auth/login");
        else setError(json.error);
        setLoading(false);
    }

    return (
        <>
            <button
                onClick={openDeleteDialog}
                className="btn btn-error btn-outline justify-start h-auto py-4"
            >
                <div className="flex items-center">
                    <BsFillTrashFill size={24} />
                    <div className="text-left ml-4">
                        <div className="font-medium">Delete Account</div>
                        <div className="text-sm text-base-content/60">
                            Permanently delete account
                        </div>
                    </div>
                </div>
            </button>
            <dialog
                id="delete_dialog"
                className={`modal ${loading ? "modal-open" : ""}`}
            >
                <div className="modal-box p-4">
                    <h2 className="text-2xl font-bold">
                        Deleting your account implies
                    </h2>
                    <br />
                    {error !== "" ? (
                        <p className="tex-red-400">{error}</p>
                    ) : null}
                    <ul className="list-disc ml-4">
                        {DELETION_IMPLICATIONS.map((d, i) => (
                            <li key={i}>
                                <p>{d}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="modal-action">
                        <button
                            className="btn btn-error"
                            onClick={() => deleteAccount()}
                            disabled={loading}
                        >
                            Delete
                        </button>
                        <form method="dialog">
                            <button className="btn" disabled={loading}>
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}
