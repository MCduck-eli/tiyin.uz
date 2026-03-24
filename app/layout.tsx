import type { Metadata } from "next";
import "./globals.css";
// IMPORTNI O'ZGARTIRING:
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/shared/navbar";
import { LanguageProvider } from "@/components/context/language-context";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
    title: "Moliya Nazorati",
    description: "Xarajatlaringizni aqlli boshqaring",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uz" suppressHydrationWarning>
            <body className="flex flex-col min-h-screen">
                <LanguageProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Navbar />
                        <main className="flex-1 pt-24">{children}</main>
                        <Footer />
                    </ThemeProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
