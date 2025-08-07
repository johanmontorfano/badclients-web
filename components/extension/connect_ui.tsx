"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// WARN: Only run client-side
function isExtensionInstalled() {
    return window.document.getElementById("badclients_ext") !== null;
}

// Will connect the badclients browser extension to the current user.
export function ExtensionConnectUI() {
    const router = useRouter();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const extensionFound = isExtensionInstalled();

        if (!extensionFound) {
            setNotFound(true);
            setTimeout(() => router.back(), 1300);
        } else pkceFlowExt();
    }, []);

    async function pkceFlowExt() {
        const client = createClient();

    }


    return <div>
        {!notFound ? null : "Extension not found, redirecting..."}
    </div> 
}
