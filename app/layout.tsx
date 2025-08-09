import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: {
        default: "Bad Clients",
        template: "%s — Bad Clients",
    },
};

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased flex flex-col min-h-screen bg-base-200">
                {props.children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
