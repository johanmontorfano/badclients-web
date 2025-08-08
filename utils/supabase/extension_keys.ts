import { createClient } from "@/utils/supabase/server";
import { v4 } from "uuid";

export interface ExtensionKey {
    id: string;
    key: string;
    user_id: string;
    usage: number;
    created_at: string;
}

// WARN: Server function using privileges
export async function authUsingExtensionKey(key: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("extension_keys")
        .select()
        .eq("key", key);

    if (error || data.length !== 1) return { error: "no key found" };

    const new_key = v4();

    await supabase
        .from("extension_keys")
        .update({
            key: new_key,
        })
        .eq("id", data[0].id);
    return { sudo_as: data[0].user_id, next_key: new_key };
}
