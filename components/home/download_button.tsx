import Image from "next/image";

export function DownloadExtensionButton(props: {
    icon: string[] | string;
    name: string;
    to: string;
}) {
    return (
        <a
            href={props.to}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn w-full rounded-sm py-8 ${props.to === "/" ? "btn-disabled" : ""}`}
        >
            {typeof props.icon !== "string" ? (
                props.icon.map((i) => (
                    <Image
                        key={i}
                        alt="download-icon"
                        src={i}
                        width={30}
                        height={30}
                        className="mr-2"
                    />
                ))
            ) : (
                <Image
                    alt="download-icon"
                    src={props.icon}
                    width={30}
                    height={30}
                    className="mr-2"
                />
            )}
            Add to {props.name}
        </a>
    );
}
