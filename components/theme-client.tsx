"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const NextThemesProvider = dynamic(
    () =>
        import("@/components/theme-provider").then((mod) => mod.ThemeProvider),
    { ssr: false },
);

export function ThemeClient({
    children,
    ...props
}: {
    children: ReactNode;
    [key: string]: any;
}) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
