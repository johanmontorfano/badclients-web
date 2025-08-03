import type { Metadata } from "next";
import { JobInputHero } from "@/components/job_analysis/job_input_hero";
import { Favicon, jersey10 } from "@/components/logo";
import { DownloadExtensionButton } from "@/components/home/download_button";

export const metadata: Metadata = {
    title: "Avoid loosing time and money for sketchy clients with Bad Clients",
    description:
        'Prevent yourself from experiencing another "Can you do it cheaper line" with Bad Clients. This tool will help you analyze any freelance proposal and avoid sketchy clients with unrealistic expectations. You can even download the extension (Chrome, Edge, Firefox) to see in real-time on Upwork, Fiverr (and soon others) bad proposals.',
};

export default function Page() {
    return (
        <div className="flex grow bg-base-300">
            <div className="container mx-auto px-4 py-4">
                <div className="hero w-full my-20">
                    <div className="hero-content w-full text-center">
                        <div className="w-full flex flex-col items-center">
                            <Favicon width={120} />
                            <h1 className={`text-6xl md:text-7xl font-bold text-primary my-6 ${jersey10.className}`}>
                                Bad Clients
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-base-content/80">
                                Spot Bad Freelance Jobs Instantly
                            </h2>
                            <div className="mb-4 w-full">
                                <JobInputHero />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mb-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="card card-border">
                            <div className="card-body">
                                <p className="text-lg md:text-xl leading-relaxed text-base-content/90">
                                    Bad Clients helps freelancers quickly spot
                                    red flags in job posts so you can avoid
                                    wasted time and sketchy clients. Use our
                                    browser extensions to get reviews directly
                                    on{" "}
                                    <span className="font-semibold text-primary">
                                        Upwork
                                    </span>
                                    ,
                                    <span className="font-semibold text-primary">
                                        {" "}
                                        Fiverr
                                    </span>
                                    , and more.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <DownloadExtensionButton icon="/assets/chrome.svg" name="Chrome" to="/" />
                    <DownloadExtensionButton icon="/assets/firefox.svg" name="Firefox" to="/" />
                    <DownloadExtensionButton icon="/assets/edge.svg" name="Edge" to="/" />
                </div>
            </div>
        </div>
    );
}
