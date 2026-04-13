"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Languages, Check } from "lucide-react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "../auth-modal";
import { supabase } from "@/lib/supabase";
import { UserNav } from "../user-nav";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const languages = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "en", label: "English", flag: "🇺🇸" },
];

export default function Navbar() {
    const { setTheme, theme } = useTheme();
    const [authType, setAuthType] = useState<"login" | "register" | null>(null);
    const [user, setUser] = useState<any>(null);

    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();
    const t = useTranslations("Navbar");

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === currentLocale) return;
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");
        router.push(newPath);
    };

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
                if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
                    router.refresh();
                }
            },
        );
        return () => authListener.subscription.unsubscribe();
    }, [router]);

    return (
        <>
            <nav className="fixed top-2 sm:top-4 inset-x-0 z-50 flex justify-center px-4 sm:px-6">
                <div className="flex items-center justify-between w-full max-w-7xl h-14 px-4 sm:px-6 bg-background/70 backdrop-blur-xl border border-border/50 rounded-full shadow-lg transition-all duration-300">
                    <Link
                        href={`/${currentLocale}`}
                        className="flex items-center gap-2 group shrink-0"
                    >
                        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
                            <span className="text-primary-foreground font-black text-sm">
                                T
                            </span>
                        </div>
                        <span className="text-lg font-black tracking-tighter">
                            Tiyin
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Languages className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="rounded-2xl mt-2 min-w-37.5"
                            >
                                {languages.map((l) => (
                                    <DropdownMenuItem
                                        key={l.code}
                                        className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-xl"
                                        onClick={() =>
                                            handleLanguageChange(l.code)
                                        }
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{l.flag}</span> {l.label}
                                        </span>
                                        {currentLocale === l.code && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>

                        <div className="h-4 w-px bg-border/60 mx-1 hidden xs:block" />

                        {user ? (
                            <UserNav user={user} />
                        ) : (
                            <div className="flex items-center gap-1 sm:gap-3">
                                <Button
                                    variant="ghost"
                                    className="rounded-full px-4 text-sm font-bold h-9"
                                    onClick={() => setAuthType("login")}
                                >
                                    {t("login")}
                                </Button>
                                <Button
                                    className="rounded-full px-5 bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 text-sm font-black h-9"
                                    onClick={() => setAuthType("register")}
                                >
                                    <span className="hidden sm:inline">
                                        {t("getStarted")}
                                    </span>
                                    <span className="sm:hidden">
                                        {t("register")}
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={authType !== null}
                onClose={() => setAuthType(null)}
                type={authType || "login"}
            />
        </>
    );
}
