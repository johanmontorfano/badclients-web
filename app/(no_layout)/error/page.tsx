"use client";

import { ErrorBoundaryUI } from "@/components/error/boundary";

export default function Page() {
    return (
        <ErrorBoundaryUI error={{ name: "", message: "" }} reset={() => {}} />
    );
}
