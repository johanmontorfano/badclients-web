import { Jersey_10 } from "next/font/google";
import FaviconLight from "@/public/assets/icon.png";
import FaviconDark from "@/public/assets/icon_dark.png";
import Image from "next/image";
import Link from "next/link";

export const jersey10 = Jersey_10({ weight: "400", subsets: ["latin"] });

export function Favicon(props: { width?: number; height?: number }) {
    return (
        <>
            <Image
                alt="favicon"
                src={FaviconLight}
                className="dark:hidden"
                {...props}
            />
            <Image
                alt="favicon"
                src={FaviconDark}
                className="hidden dark:block"
                {...props}
            />
        </>
    );
}

export function Logo() {
    return (
        <Link className={`btn btn-ghost text-4xl ${jersey10.className}`} href="/">
            <Favicon width={30} height={40} />
            Bad Clients
        </Link>
    );
}
