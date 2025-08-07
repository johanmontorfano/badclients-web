import { ExtensionConnectUI } from "@/components/extension/connect_ui";

export default function Page() {
    return (<>
        <div className="flex items-center">
            <span className="loading loading-spinner loading-lg" />
            <p className="font-bold text-2xl ml-4">Connecting the extension</p>
        </div>
        <ExtensionConnectUI />
        </>
    );
}
