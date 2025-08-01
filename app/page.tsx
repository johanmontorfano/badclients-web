"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [input, setInput] = useState("");

    async function analyzeJobPost() {
        if (input.trim().length < 20) return;
    
        localStorage.setItem("homeRequest", input.trim());
        router.push("/verify");
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-base-200">
            <h1 className="text-4xl font-bold mb-6 text-center">
                BadClients — Spot Bad Freelance Jobs Instantly
            </h1>
            <p className="text-red-500">DEMO VIDEO IN BACKGROUND</p>
            <div className="join">
                <input
                    className="input input-bordered w-[600px] mb-4 join-item"
                    placeholder="Paste the freelance job post here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="btn btn-primary mb-6 join-item"
                    onClick={analyzeJobPost}
                    disabled={input.trim().length < 20}
                >
                    Analyze
                </button>
            </div>
            <section className="max-w-3xl text-center mb-8 px-4">
                <p className="mb-4 text-lg max-w-xl mx-auto leading-relaxed">
                    BadClients helps freelancers quickly spot red flags
                    in job posts so you can avoid wasted time and sketchy
                    clients. Use our browser extensions to get reviews directly
                    on Upwork, Fiverr, and more.
                </p>
            </section>
            <section className="flex gap-8 justify-center flex-wrap max-w-3xl">
                <a
                    href="https://chrome.google.com/webstore/detail/your-extension-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-md w-28 hover:scale-105 transform transition"
                >
                    <img
                        src="/assets/chrome.svg"
                        alt="Chrome Extension"
                        className="w-12 h-12"
                    />
                    <span className="text-indigo-800 font-semibold text-center">
                        Chrome
                    </span>
                </a>

                <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/your-extension-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-md w-28 hover:scale-105 transform transition"
                >
                    <img
                        src="/assets/firefox.svg"
                        alt="Firefox Extension"
                        className="w-12 h-12"
                    />
                    <span className="text-indigo-800 font-semibold text-center">
                        Firefox
                    </span>
                </a>

                <a
                    href="https://microsoftedge.microsoft.com/addons/detail/your-extension-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-md w-28 hover:scale-105 transform transition"
                >
                    <img
                        src="/assets/edge.svg"
                        alt="Edge Extension"
                        className="w-12 h-12"
                    />
                    <span className="text-indigo-800 font-semibold text-center">
                        Edge
                    </span>
                </a>
            </section>
        </main>
    );
}
