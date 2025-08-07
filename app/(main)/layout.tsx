import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/navbar/navbar";

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
                <Navbar />
                {props.children}
            </body>
        </html>
    );
}
