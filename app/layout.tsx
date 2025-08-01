import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

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
