import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Password Management",
};

export default function Layout(props: { children: ReactNode }) {
    return props.children;
}
