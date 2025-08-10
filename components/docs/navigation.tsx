"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/docs", label: "Overview" },
    { href: "/docs/extension", label: "Extension" },
    { href: "/docs/upcoming", label: "Upcoming features" }
];

export function DocsNavigation() {
    const pathname = usePathname();

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
        <>
            <div className="navbar bg-base-100 shadow-sm absolute lg:hidden">
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
            <aside className="w-64 bg-base-100 shadow-sm p-4 hidden lg:block">
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
        </>
    );
}
