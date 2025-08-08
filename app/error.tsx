"use client";

import { ErrorBoundaryUI } from "@/components/error/boundary";

export default function Error(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
    return <ErrorBoundaryUI {...props} />
}
