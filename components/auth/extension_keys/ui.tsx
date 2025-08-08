"use client";

import { PlanTiers } from "@/utils/stripe/plans";
import { useState } from "react";
import { BsExclamationTriangle, BsKey } from "react-icons/bs";
import { CreateKeyButton } from "./create_key";
import { CopyKeyButton } from "./copy_key";
import { DeleteKeyButton } from "./delete_key";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/toast/new";

interface ExtensionKey {
    id: string;
    key: string;
    user_id: string;
    usage: number;
    created_at: string;
}

// INFO: Since keys are rotating (docs/extension_keys) and extensions will not
// be able to use keys identifiers for security reasons, the key copied is the
// rotating key.
export function StatefulPart(props: {
    initialState: ExtensionKey[];
    planType: PlanTiers;
    maxKeys: number;
    userId: string;
}) {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [keys, setKeys] = useState(props.initialState);

    const canCreateMore = keys.length < props.maxKeys;

    async function loadKeys() {
    const { data: extensionKeys, error } = await supabase
        .from("extension_keys")
        .select("*")
        .eq("user_id", props.userId)
        .order("created_at", { ascending: false });

        if (error || extensionKeys === null)
            toast("Failed to reload keys");
        else
            setKeys(extensionKeys as ExtensionKey[]);
    }

    function getPlanDisplayName(planType: PlanTiers) {
        switch (planType) {
            case PlanTiers.Lifetime:
                return "Lifetime";
            case PlanTiers.Hunter:
                return "Hunter";
            default:
                return "Free";
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function truncateKey(key: string) {
        return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
    }

    return (
        <>
            <div className="bg-base-100 rounded-lg p-8 mb-8 border border-base-300">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                            Key Usage
                        </h3>
                        <p className="text-base-content text-lg">
                            {keys.length} of {props.maxKeys} keys used (
                            {getPlanDisplayName(props.planType)} plan)
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        {!canCreateMore && (
                            <div className="flex items-center text-warning gap-2">
                                <BsExclamationTriangle size={20} />
                                <span className="text-sm">Limit reached</span>
                            </div>
                        )}
                        {canCreateMore ? (
                            <CreateKeyButton
                                loading={isLoading}
                                toggleLoading={() => {
                                    setIsLoading(p => !p);
                                    loadKeys();
                                }}
                            />
                        ) : (
                            <a
                                href="/pricing"
                                className="btn btn-outline btn-sm"
                            >
                                Upgrade Plan →
                            </a>
                        )}
                    </div>
                </div>
                <progress
                    className="progress w-full mt-4"
                    value={(keys.length / props.maxKeys) * 100}
                    max={100}
                />
            </div>
            <div className="bg-base-100 rounded-lg border border-base-300">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-base-content">
                            Your Extension Keys
                        </h3>
                        {keys.length > 0 && canCreateMore && (
                            <CreateKeyButton
                                loading={isLoading}
                                toggleLoading={() => {
                                    setIsLoading(p => !p);
                                    loadKeys();
                                }}
                            />
                        )}
                    </div>
                    {keys.length === 0 ? (
                        <div className="text-center py-12">
                            <BsKey
                                size={48}
                                className="mx-auto text-base-content/30 mb-4"
                            />
                            <h4 className="text-lg font-medium text-base-content mb-2">
                                No extension keys yet
                            </h4>
                            <p className="text-base-content/60 mb-6">
                                Create your first extension key to connect the
                                Bad Clients browser extension with your account.
                            </p>
                            {canCreateMore && (
                                <CreateKeyButton
                                    loading={isLoading}
                                    toggleLoading={() => {
                                        setIsLoading(p => !p);
                                        loadKeys();
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th className="text-base-content/60">
                                            Key
                                        </th>
                                        <th className="text-base-content/60">
                                            Usage
                                        </th>
                                        <th className="text-base-content/60">
                                            Created
                                        </th>
                                        <th className="text-base-content/60">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keys.map((key) => (
                                        <tr key={key.id} className="hover">
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-base-200 px-2 py-1 rounded text-sm">
                                                        {truncateKey(key.id)}
                                                    </code>
                                                    <CopyKeyButton
                                                        keyValue={key.key}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <span>
                                                    {key.usage} requests
                                                </span>
                                            </td>
                                            <td className="text-base-content/60">
                                                {formatDate(key.created_at)}
                                            </td>
                                            <td><DeleteKeyButton keyId={key.id} onDeleted={() => loadKeys()} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {keys.length > 0 && (
                    <div className="bg-base-200 px-8 py-4 rounded-b-lg">
                        <p className="text-sm text-base-content/60">
                            <BsExclamationTriangle className="inline mr-1" />
                            Keep your extension keys secure. Anyone with access
                            to these keys can make requests using your account.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
