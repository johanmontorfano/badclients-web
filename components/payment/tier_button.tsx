"use client";

import { redirect } from "next/navigation";

// A button that redirects to the appropriate endpoint depending on the choosen
// pricing offer.
export function PricingButton(props: {
    url: string;
    mode: string;
    curr: "USD" | "EUR";
}) {
    async function handleClick(url: string, mode: string) {
        if (mode === "redirect") redirect(url);
        else {
            const res = await fetch(`${url}&curr=${props.curr}`, {
                method: "POST",
            });

            if (res.ok) {
                const { url } = await res.json();

                redirect(url);
            }
        }
    }
    return (
        <button
            className="btn btn-primary btn-block"
            onClick={() => handleClick(props.url, props.mode)}
        >
            Continue
        </button>
    );
}
