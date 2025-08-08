import { BsTrash } from "react-icons/bs";
import { useState } from "react";
import { toast } from "@/components/toast/new";

export function DeleteKeyButton(props: {
    keyId: string;
    fullText?: boolean;
    onDeleted: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleDelete() {
        setIsLoading(true);

        try {
            const res = await fetch("/api/users/keys/delete", {
                method: "DELETE",
                body: JSON.stringify({
                    key_id: props.keyId,
                }),
            });

            const body = await res.json();

            if (body.error) toast("Deletion failed: " + body.error);
            props.onDeleted();
        } catch (e) {
            toast("Deletion failed: " + e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className={`btn ${props.fullText ? "" : "btn-ghost"} btn-sm text-error hover:bg-error hover:text-error-content`}
            >
                {props.fullText ? "Delete key" : <BsTrash size={16} />}
            </button>
            {showConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            Delete Extension Key
                        </h3>
                        <p className="py-4">
                            Are you sure you want to delete the key{" "}
                            <code className="bg-base-200 px-2 py-1 rounded">
                                {props.keyId}
                            </code>
                            ? This action cannot be undone and will immediately
                            disable the key.
                        </p>
                        <div className="modal-action">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn btn-ghost"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="btn btn-error"
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Delete Key"
                                )}
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowConfirm(false)}
                    ></div>
                </div>
            )}
        </>
    );
}
