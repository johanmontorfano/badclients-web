import { BsCopy, BsCheck } from "react-icons/bs";
import { useState } from "react";

export function CopyKeyButton(props: { keyValue: string }) {
    const [isCopied, setIsCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(props.keyValue);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy key:", error);
        }
    }

    return (
        <button
            onClick={handleCopy}
            className={`btn btn-ghost btn-xs ${
                isCopied
                    ? "text-success"
                    : "text-base-content/60 hover:text-base-content"
            }`}
            title="Copy rotating key"
        >
            {isCopied ? <BsCheck size={14} /> : <BsCopy size={12} />}
        </button>
    );
}
