import React from "react";

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center grow">
            {props.children}
        </div>
    );
}
