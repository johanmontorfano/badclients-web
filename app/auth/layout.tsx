import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: {
        default: "Authentication",
        absolute: "Auth",
    },
};

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center grow">
            {props.children}
        </div>
    );
}
