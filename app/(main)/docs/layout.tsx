import type { Metadata } from "next";
import { DocsNavigation } from "@/components/docs/navigation";
import { getMDXMetadata } from "@/utils/docs/mdx";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const pathname = headerList.get("x-pathname")!;
    const metadata = getMDXMetadata(pathname.slice(6).split("/"));

    if (!metadata) {
        return {
            title: "Documentation",
            description: "Documentation for Bad Clients",
        };
    }

    return {
        title: metadata.title,
        description: metadata.description,
        openGraph: {
            title: metadata.title,
            description: metadata.description,
            type: "article",
        },
        twitter: {
            card: "summary",
            title: metadata.title,
            description: metadata.description,
        },
    };
}

export default function DocsLayout(props: { children: React.ReactNode }) {
    return (
        <div className="flex grow">
            <DocsNavigation />
            <div className="flex grow overflow-hidden bg-base-300 max-h-[93dvh] overflow-y-auto">
                <main className="flex-1 grow w-full">
                    <div className="max-w-[700px] mx-auto px-4 py-8 max-lg:pt-16">
                        {props.children}
                    </div>
                </main>
            </div>
        </div>
    );
}
