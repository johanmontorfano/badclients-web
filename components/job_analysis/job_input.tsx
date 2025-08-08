import { useEffect, useRef } from "react";
import { BsArrowUpShort } from "react-icons/bs";

interface JobInputSectionProps {
    input: string;
    loading: boolean;
    requestsLeft?: number;
    planTimeRange?: "day" | "month";
    setInput: (value: string) => void;
    setErrorCode: (error: string) => void;
    analyzeJobPost: () => void;
}

export function JobInputSection({
    input,
    loading,
    requestsLeft,
    planTimeRange,
    setInput,
    setErrorCode,
    analyzeJobPost,
}: JobInputSectionProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Purposely returns 1 request left if the attribute is not provided
    function getRequestsLeft() {
        return requestsLeft !== undefined ? requestsLeft : 1;
    }

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
        }
    }, [input]);

    const isValidInput = input.trim().length >= 20;

    function handleKeyDown(e: React.KeyboardEvent) {
        if (
            e.key === "Enter" &&
            (e.metaKey || e.ctrlKey) &&
            isValidInput &&
            !loading &&
            getRequestsLeft() > 0
        ) {
            e.preventDefault();
            analyzeJobPost();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative">
                <div className="border border-base-300 rounded-xl bg-base-100 focus-within:border-primary transition-colors duration-200">
                    <textarea
                        ref={textareaRef}
                        className="w-full p-4 pr-16 bg-transparent border-none outline-none resize-none min-h-[60px] max-h-[200px] placeholder:text-base-content/50"
                        placeholder="Paste your freelance job post here..."
                        value={input}
                        disabled={loading}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setErrorCode("");
                            setInput(e.target.value);
                        }}
                    />

                    <div className="absolute bottom-9 right-3">
                        <button
                            className={`btn btn-circle btn-sm ${
                                isValidInput &&
                                !loading &&
                                getRequestsLeft() > 0
                                    ? "btn-primary"
                                    : "btn-disabled bg-base-300"
                            }`}
                            onClick={analyzeJobPost}
                            disabled={
                                !isValidInput ||
                                loading ||
                                getRequestsLeft() <= 0
                            }
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-xs" />
                            ) : (
                                <BsArrowUpShort size={25} />
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-xs text-base-content/50">
                        {input.length < 20 ? (
                            `${20 - input.length} more characters needed`
                        ) : (
                            <>
                                <kbd className="kbd kbd-sm">Cmd/Ctrl</kbd> +{" "}
                                <kbd className="kbd kbd-sm">Enter</kbd> to
                                analyze
                            </>
                        )}
                    </span>

                    {typeof requestsLeft === "number" && (
                        <span className="text-xs text-base-content/60">
                            {requestsLeft} requests left{" "}
                            {planTimeRange && planTimeRange === "day"
                                ? "today"
                                : "this month"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
