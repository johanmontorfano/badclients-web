"use client";

export default function JobAnalysis(props: { flags: Record<string, any> }) {
    const { score } = props.flags;

    return (
        <>
            <div className="card bg-base-200 shadow-md">
                <div className="card-body p-4">
                    <h2 className="card-title text-sm text-gray-500">
                        Worth Score
                    </h2>
                    <p className="text-3xl font-bold text-primary">
                        {score}/100
                    </p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full mt-2">
                    <thead>
                        <tr>
                            <th className="text-sm text-gray-500">Criteria</th>
                            <th className="text-sm text-gray-500">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(props.flags)
                            .filter((k) => k !== "score")
                            .map((key, i) => (
                                <tr key={i}>
                                    <td className="capitalize font-medium">
                                        {key}
                                    </td>
                                    <td>{props.flags[key]}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
