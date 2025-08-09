"use server";

import { JobAnalysisErrors } from "@/components/job_analysis/data";
import { planRequiresReset, PlanTiers, planUsage } from "@/utils/stripe/plans";
import { authUsingExtensionKey } from "@/utils/supabase/extension_keys";
import { createClient } from "@/utils/supabase/server";
import { updateUserMetadata, UserMetadata } from "@/utils/supabase/users";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Prompts from "@/utils/prompts.json";

function unwrapMarkdown(text: any): any {
    if (typeof text === "object") return text;

    const trimmed = text.trim();

    if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
        const lines = trimmed.split("\n");

        if (lines.length >= 3)
            return JSON.parse(lines.slice(1, -1).join("\n").trim());
    }

    return text;
}

async function generateFlags(text: string, prompt: keyof typeof Prompts): Promise<[number, string[]]> {
    const payload = {
        model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages: [
            {
                role: "system",
                content: Prompts[prompt].join("\n")
            },
            {
                role: "user",
                content: text,
            },
        ],
        temperature: 0,
        max_tokens: 512,
    };

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: [
                ["Authorization", `Bearer ${process.env.OPENROUTER_API_KEY!}`],
                ["Content-Type", "application/json"],
                ["HTTP-Referer", process.env.OPENROUTER_REFERER!],
                ["X-Title", process.env.OPENROUTER_TITLE!],
            ],
            body: JSON.stringify(payload),
        },
    );

    const content = await response.json();

    if (content.choices)
        return unwrapMarkdown(content.choices[0].message.content);
    return content;
}

// TODO: Is this a great idea ?
function headers() {
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://www.upwork.com",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Private-Network": "true",
    };
}

/* Will authenticate the user either with supabase session or extension key.
 * It is assumed that the Authorization header is formatted as:
 *
 * ```
 * Authorization: Bearer [key]
 * ```
 *
 * */
async function sbaseAndExtKeyAuth(sb: SupabaseClient, req: NextRequest) {
    const { data, error } = await sb.auth.getUser();

    if (error) {
        const authorization = req.headers.get("Authorization");

        if (authorization === null || !authorization.startsWith("Bearer "))
            return {
                error: "failed to auth with supabase and no extension key provided",
            };

        const extKey = authorization.replace("Bearer ", "");
        const authAs = await authUsingExtensionKey(extKey);

        if (authAs.error !== undefined) return { error: authAs.error };

        const { data, error } = await sb.auth.admin.getUserById(authAs.sudo_as);

        if (error) return { error: error.name };
        return { user: data.user, nextKey: authAs.next_key };
    }
    return { user: data.user };
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: headers(),
        },
    );
}

// As of docs/extension_keys, this route allows for extension keys to be used
// as user authentication token. The key has to be provided in the
// Authorization header.
export async function POST(req: NextRequest) {
    // Before anything, we verify that the user has enough credits to do the
    // operation. Every client is an user (anonymous by default), this way we
    // are always able to check remaining credits.
    const supabase = await createClient();
    const { user, error, nextKey } = await sbaseAndExtKeyAuth(supabase, req);
    const inExtension = nextKey !== undefined;

    if (error || user === undefined)
        return NextResponse.json(
            {
                error: JobAnalysisErrors.AuthenticationFailed,
                message: error || "User not found",
            },
            { status: 403, headers: headers() },
        );

    const { input } = (await req.json()) || { input: undefined };

    if (!input)
        return NextResponse.json(
            { error: JobAnalysisErrors.ContentMissing, nextKey },
            { status: 400, headers: headers() },
        );

    const metadata = user.user_metadata as UserMetadata;
    const { planType } = metadata;
    const { usage: maxUsage } = planUsage[planType];
    let { usage, usageLastReset } = metadata;

    if (planRequiresReset(planType, usageLastReset)) {
        await updateUserMetadata(user.id, {
            usage: 0,
            usageLastReset: Date.now(),
        });
        usage = 0;
        usageLastReset = Date.now();
    }

    if (usage >= maxUsage && false)
        return NextResponse.json(
            {
                error: JobAnalysisErrors.NotEnoughCredits,
                accountType: user.is_anonymous ? "anon" : "perma",
                nextKey,
            },
            { status: 403, headers: headers() },
        );
    await updateUserMetadata(user.id, { usage: usage + 1 });

    const flags = await generateFlags(input, inExtension ? (
        planType === PlanTiers.Free ? "in_extension::free" : "in_extension::*"
    ) : "in_app");

    return NextResponse.json(
        { flags, remainingUsages: maxUsage - usage - 1, nextKey },
        { headers: headers() },
    );
}
