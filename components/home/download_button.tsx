export function DownloadExtensionButton(props: { icon: string, name: string, to: string }) {
    return (
        <a
            href={props.to}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full rounded-sm py-8"
        >
            <img src={props.icon} width={30} className="mr-2" />
            Add to {props.name}
        </a>
    );
}
