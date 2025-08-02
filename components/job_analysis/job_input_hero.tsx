"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { JobInputSection } from "./job_input";

// Job input component as a hero for the home page.
export function JobInputHero() {
    const router = useRouter();
    const [input, setInput] = useState("");

    return (
        <JobInputSection
            input={input}
            setInput={setInput}
            setErrorCode={() => {}}
            loading={false}
            analyzeJobPost={() => {
                const url = new URL(origin + "/app");
                url.searchParams.append("home_input_content", input);

                router.push(url.toString());
            }}
        />
    );
}
