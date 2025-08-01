// components/mdx-components.js
import Link from "next/link";

const mdxComponents = {
    h1: ({ children, ...props }) => (
        <h1
            className="text-3xl font-bold mb-6 mt-8 text-base-content border-b border-base-300 pb-2"
            {...props}
        >
            {children}
        </h1>
    ),
    h2: ({ children, ...props }) => (
        <h2
            className="text-2xl font-semibold mb-4 mt-6 text-base-content"
            {...props}
        >
            {children}
        </h2>
    ),
    h3: ({ children, ...props }) => (
        <h3
            className="text-xl font-medium mb-3 mt-5 text-base-content"
            {...props}
        >
            {children}
        </h3>
    ),
    p: ({ children, ...props }) => (
        <p className="mb-4 leading-relaxed text-base-content" {...props}>
            {children}
        </p>
    ),
    ul: ({ children, ...props }) => (
        <ul className="mb-4 ml-6 list-disc" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }) => (
        <ol className="mb-4 ml-6 list-decimal" {...props}>
            {children}
        </ol>
    ),
    li: ({ children, ...props }) => (
        <li className="mb-2 text-base-content" {...props}>
            {children}
        </li>
    ),
    a: ({ href, children, ...props }) => {
        const isExternal = href?.startsWith("http");
        if (isExternal) {
            return (
                <a
                    href={href}
                    className="link link-primary hover:link-hover"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link
                href={href || "#"}
                className="link link-primary hover:link-hover"
                {...props}
            >
                {children}
            </Link>
        );
    },
    blockquote: ({ children, ...props }) => (
        <blockquote
            className="border-l-4 border-primary pl-4 italic my-4 bg-base-200 p-4 rounded-r"
            {...props}
        >
            {children}
        </blockquote>
    ),
    code: ({ children, className, ...props }) => {
        // Check if it's a code block or inline code
        if (className?.includes("language-")) {
            return (
                <code
                    className={`${className} block bg-base-300 p-4 rounded-lg overflow-x-auto text-base-content font-mono`}
                    {...props}
                >
                    {children}
                </code>
            );
        }
        return (
            <code
                className="bg-base-200 px-2 py-1 rounded text-sm font-mono text-primary"
                {...props}
            >
                {children}
            </code>
        );
    },
    pre: ({ children, ...props }) => (
        <pre
            className="bg-base-300 p-4 rounded-lg overflow-x-auto mb-4"
            {...props}
        >
            {children}
        </pre>
    ),
    table: ({ children, ...props }) => (
        <div className="overflow-x-auto mb-4">
            <table className="table table-zebra w-full" {...props}>
                {children}
            </table>
        </div>
    ),
    th: ({ children, ...props }) => (
        <th className="font-semibold" {...props}>
            {children}
        </th>
    ),
    img: ({ alt, ...props }) => (
        <img className="rounded-lg shadow-md mx-auto" alt={alt} {...props} />
    ),
    hr: (props) => <hr className="border-base-300 my-8" {...props} />,
    // Custom alert component
    Alert: ({ type = "info", children }) => (
        <div className={`alert alert-${type} mb-4`}>
            <svg
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
            <div>{children}</div>
        </div>
    ),
};

export default mdxComponents;
