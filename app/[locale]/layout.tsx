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
    title: "Tiyin.uz - O'zbekistondagi moliya va hisob-kitob platformasi",
    description:
        "Tiyin.uz orqali pullaringizni hisoblang, valyuta kurslarini kuzating va moliyaviy savodxonligingizni oshiring.",
    keywords: [
        "moliya",
        "pul hisoblash",
        "tiyin uz",
        "valyuta kursi",
        "o'zbekiston moliya",
    ],
    icons: {
        icon: "/icon.png",
        apple: "/icon.png",
    },
    openGraph: {
        title: "Tiyin.uz - Aqlli moliya boshqaruvi",
        description: "Shaxsiy mablag'laringizni biz bilan oson boshqaring.",
        url: "https://tiyin-uz.vercel.app",
        siteName: "Tiyin uz",
        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
                alt: "Tiyin.uz Logo",
            },
        ],
        locale: "uz_UZ",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Tiyin.uz - Aqlli moliya boshqaruvi",
        description: "Mablag'laringizni biz bilan oson boshqaring.",
        images: ["/logo.png"],
    },
    verification: {
        google: "xuh_Bj1w4NoxQDiNuuG1yIVzivjk60L0GcwNe0LKVf8",
    },
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
