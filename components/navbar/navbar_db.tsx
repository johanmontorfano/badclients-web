export const links: Record<string, string | Record<string, string>> = {
    Analyze: "/app",
    Documentation: {
        Overview: "/docs",
        "How-To": "/docs/howto",
        Extension: "/docs/extension",
        Billing: "/docs/billing",
    },
    Pricing: "/pricing",
};

export function RenderDesktopLinks(props: {
    links: typeof links;
    dropdown?: boolean;
}) {
    return (
        <ul
            className={`${props.dropdown ? "dropdown-content" : "menu-horizontal"} flex items-center menu px-1`}
        >
            {Object.keys(props.links).map((l) => {
                if (typeof props.links[l] === "string")
                    return (
                        <li key={props.links[l]}>
                            <a href={props.links[l]}>{l}</a>
                        </li>
                    );
                return (
                    <li key={props.links[l]}>
                        <details className="dropdown">
                            <summary className="m-1">{l}</summary>
                            <RenderDesktopLinks
                                links={props.links[l]}
                                dropdown
                            />
                        </details>
                    </li>
                );
            })}
        </ul>
    );
}

export function RenderNavbarLinks(props: {
    links: typeof links;
    dropdown?: boolean;
}) {
    return (
        <ul
            className={`${props.dropdown ? "pl-4" : ""} w-full menu menu-vertical flex flex-col`}
        >
            {Object.keys(props.links).map((l) => {
                if (typeof props.links[l] === "string")
                    return (
                        <li key={props.links[l]}>
                            <a href={props.links[l]}>{l}</a>
                        </li>
                    );
                return (
                    <li key={l} className="mb-2">
                        <div className="font-medium pb-1 border-b border-base-300">
                            {l}
                        </div>
                        <RenderNavbarLinks links={props.links[l]} dropdown />
                    </li>
                );
            })}
        </ul>
    );
}
