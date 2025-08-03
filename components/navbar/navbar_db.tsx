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
            className={`${
                props.dropdown
                    ? "dropdown-content menu bg-base-100 rounded-box shadow-xl border border-base-300 min-w-[200px] p-3 z-[1]"
                    : "menu menu-horizontal flex items-center gap-2"
            }`}
        >
            {Object.keys(props.links).map((l) => {
                if (typeof props.links[l] === "string") {
                    return (
                        <li key={props.links[l]}>
                            <a
                                href={props.links[l]}
                                className={`${
                                    props.dropdown
                                        ? "rounded-lg transition-all duration-200 font-medium"
                                        : "btn btn-ghost rounded-btn transition-all duration-200 font-medium"
                                }`}
                            >
                                {l}
                            </a>
                        </li>
                    );
                }

                return (
                    <li key={l}>
                        <div
                            className={`dropdown dropdown-hover ${props.dropdown ? "dropdown-right" : "dropdown-end"}`}
                        >
                            <div
                                tabIndex={0}
                                role="button"
                                className={`${
                                    props.dropdown
                                        ? "flex items-center justify-between w-full rounded-lg hover:bg-primary hover:text-primary-content transition-all duration-200 px-4 font-medium group"
                                        : "transition-all duration-200 font-medium group"
                                }`}
                            >
                                <span>{l}</span>
                            </div>
                            <RenderDesktopLinks
                                links={props.links[l]}
                                dropdown
                            />
                        </div>
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
