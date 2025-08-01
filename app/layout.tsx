import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Navbar />
                {props.children}
            </body>
        </html>
    );
}
