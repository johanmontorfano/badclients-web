import { toast } from "@/components/toast/new";
import { BsPlus } from "react-icons/bs";

export function CreateKeyButton(props: {
    loading: boolean;
    toggleLoading: () => void;
}) {
    async function handleCreateKey() {
        props.toggleLoading();

        try {
            const res = await fetch("/api/users/keys/create", {
                method: "POST",
            });

            const body = await res.json();

            if (body.error) toast("Creation failed: " + body.error);
        } catch (e) {
            toast("Creation failed: " + e);
        } finally {
            props.toggleLoading();
        }
    }

    return (
        <button
            onClick={handleCreateKey}
            disabled={props.loading}
            className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content"
        >
            {props.loading ? (
                <span className="loading loading-spinner loading-sm"></span>
            ) : (
                <BsPlus size={20} />
            )}
            Add Key
        </button>
    );
}
