"use client";

export function JobAnalysis(props: { flags: Record<string, any> }) {
    const { score, description } = props.flags;

    // Filter out score and description from other flags
    const otherFlags = Object.keys(props.flags)
        .filter((k) => k !== "score" && k !== "description")
        .reduce(
            (obj, key) => {
                obj[key] = props.flags[key];
                return obj;
            },
            {} as Record<string, any>,
        );

    return (
        <div className="space-y-4 md:w-[500px]">
            <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-lg">
                <div className="card-body p-6 text-center">
                    <h2 className="card-title text-base text-primary font-semibold justify-center mb-2">
                        Worth Score
                    </h2>
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-5xl font-bold text-primary">
                            {score}
                        </span>
                        <span className="text-2xl text-base-content/70 font-medium">
                            /100
                        </span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2 mt-4">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(score, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            {description && (
                <div className="card bg-base-100 border-l-4 border-l-secondary shadow-md">
                    <div className="card-body p-4">
                        <h3 className="font-semibold text-secondary text-sm uppercase tracking-wide mb-2">
                            Description
                        </h3>
                        <p className="text-base-content leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            )}
            {Object.keys(otherFlags).length > 0 && (
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                        <h3 className="font-semibold text-base-content/80 text-sm uppercase tracking-wide mb-3">
                            Additional Criteria
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(otherFlags).map(
                                ([key, value], i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0"
                                    >
                                        <span className="capitalize font-medium text-base-content/80">
                                            {key
                                                .replace(/([A-Z])/g, " $1")
                                                .trim()}
                                        </span>
                                        <span className="text-base-content font-medium">
                                            {value}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
