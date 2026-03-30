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
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
            },
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    return (
        <>
            <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-6">
                <div className="flex items-center justify-between w-full max-w-7xl h-14 px-6 bg-background/60 backdrop-blur-xl border border-border rounded-[22px] shadow-sm transition-all duration-300">
                    <Link
                        href={`/${currentLocale}`}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <span className="text-primary-foreground font-bold text-sm">
                                T
                            </span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight">
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
                                    <Languages className="h-[1.1rem] w-[1.1rem]" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="rounded-xl mt-2 min-w-35"
                            >
                                {languages.map((l) => (
                                    <DropdownMenuItem
                                        key={l.code}
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() =>
                                            handleLanguageChange(l.code)
                                        }
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{l.flag}</span>
                                            {l.label}
                                        </span>
                                        {currentLocale === l.code && (
                                            <Check className="h-4 w-4 opacity-50" />
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
                            <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>

                        <div className="h-4 w-px bg-border mx-1" />
                        {user ? (
                            <UserNav user={user} />
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="hidden sm:flex rounded-full px-5 text-sm font-medium"
                                    onClick={() => setAuthType("login")}
                                >
                                    {t("login")}{" "}
                                </Button>

                                <Button
                                    className="rounded-full px-6 bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
                                    onClick={() => setAuthType("register")}
                                >
                                    {t("getStarted")}
                                </Button>
                            </>
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
