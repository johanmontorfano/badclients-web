import type { Metadata } from "next";
import { JobInputHero } from "@/components/job_analysis/job_input_hero";

export const metadata: Metadata = {
    title: "Avoid loosing time and money for sketchy clients with Bad Clients",
    description:
        'Prevent yourself from experiencing another "Can you do it cheaper line" with Bad Clients. This tool will help you analyze any freelance proposal and avoid sketchy clients with unrealistic expectations. You can even download the extension (Chrome, Edge, Firefox) to see in real-time on Upwork, Fiverr (and soon others) bad proposals.',
};

export default function Page() {
    return (
        <div className="grow flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">
                BadClients — Spot Bad Freelance Jobs Instantly
            </h1>
            <p className="text-red-500">DEMO VIDEO IN BACKGROUND</p>
            <JobInputHero />
            <section className="max-w-3xl text-center mb-8 px-4">
                <p className="mb-4 text-lg max-w-xl mx-auto leading-relaxed">
                    Bad Clients helps freelancers quickly spot red flags in job
                    posts so you can avoid wasted time and sketchy clients. Use
                    our browser extensions to get reviews directly on Upwork,
                    Fiverr, and more.
                </p>
            </section>
            <section className="flex gap-8 justify-center flex-wrap max-w-3xl">
                <a
                    href="https://chrome.google.com/webstore/detail/your-extension-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2 p-4 bg-base-100 rounded-md shadow-md w-28 hover:scale-105 transform transition"
                >
                    <img
                        src="/assets/chrome.svg"
                        alt="Chrome Extension"
                        className="w-12 h-12"
                    />
                    <span className="text-indigo-400 font-semibold text-center">
                        Chrome
                    </span>
                </a>

                <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/your-extension-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2 p-4 bg-base-100 rounded-md shadow-md w-28 hover:scale-105 transform transition"
                >
                    <img
                        src="/assets/firefox.svg"
                        alt="Firefox Extension"
                        className="w-12 h-12"
                    />
                    <span className="text-indigo-400 font-semibold text-center">
                        Firefox
                    </span>
                </a>

                <a
                    href="https://microsoftedge.microsoft.com/addons/detail/your-extension-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2 p-4 bg-base-100 rounded-md shadow-md w-28 hover:scale-105 transform transition"
                >
                    <img
                        src="/assets/edge.svg"
                        alt="Edge Extension"
                        className="w-12 h-12"
                    />
                    <span className="text-indigo-400 font-semibold text-center">
                        Edge
                    </span>
                </a>
            </section>
        </div>
    );
}
