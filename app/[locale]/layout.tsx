import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ClientWrapper } from "@/components/shared/client-wrapper";
import { ThemeClient } from "@/components/theme-client";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Moliya Nazorati",
    description: "Xarajatlaringizni aqlli boshqaring",
};

const locales = ["uz", "ru", "en"];

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className="flex flex-col min-h-screen antialiased">
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ThemeClient
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ClientWrapper>
                            <Navbar />
                            <main className="flex-1 pt-24">{children}</main>
                            <Footer />
                        </ClientWrapper>
                    </ThemeClient>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
