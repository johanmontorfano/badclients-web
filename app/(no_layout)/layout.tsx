export default function NoLayout(props: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen flex flex-col justify-center">
            <div className="p-4 px-18">{props.children}</div>
        </div>
    );
}
