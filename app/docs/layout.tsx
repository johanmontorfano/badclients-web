"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
    { href: "/docs", label: "Overview" },
    { href: "/docs/howto", label: "How-to" },
    { href: "/docs/extension", label: "Extension" },
    { href: "/docs/billing", label: "Billing" }
];

export default function DocsLayout(props: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Generate breadcrumbs from current path
    const generateBreadcrumbs = () => {
        const currentLink = links.find((link) => link.href === pathname);
        return [
            { href: "/docs", label: "Documentation" },
            ...(currentLink && currentLink.href !== "/docs"
                ? [currentLink]
                : []),
        ];
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <div className="flex grow bg-base-200">
            <div className="navbar bg-base-100 shadow-sm md:hidden">
                <div className="navbar-start">
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
                <div className="navbar-center">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            {breadcrumbs.map((crumb, index) => (
                                <li key={crumb.href}>
                                    {index === breadcrumbs.length - 1 ? (
                                        <span className="font-semibold">
                                            {crumb.label}
                                        </span>
                                    ) : (
                                        <Link
                                            href={crumb.href}
                                            className="link link-hover"
                                        >
                                            {crumb.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex grow">
                <aside className="w-64 bg-base-100 shadow-sm p-4 hidden md:block">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-base-content">
                            Documentation
                        </h2>
                    </div>
                    <ul className="menu bg-base-100 w-full">
                        {links.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`${
                                        pathname === href
                                            ? "active bg-primary text-primary-content font-semibold"
                                            : "hover:bg-base-200"
                                    }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <div
                    className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? "block" : "hidden"}`}
                >
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed left-0 top-0 w-64 h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-base-content">
                                Documentation
                            </h2>
                            <button
                                className="btn btn-sm btn-ghost btn-circle"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <ul className="menu bg-base-100 w-full">
                            {links.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`${
                                            pathname === href
                                                ? "active bg-primary text-primary-content font-semibold"
                                                : "hover:bg-base-200"
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
                <main className="flex-1 grow w-full">
                    <div className="max-w-[700px] mx-auto px-4 py-8">
                        {props.children}
                    </div>
                </main>
            </div>
        </div>
    );
}
