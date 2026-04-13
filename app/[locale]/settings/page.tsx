"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "@/components/context/language-context";
import { Language } from "@/lib/dictionary";
import {
    Moon,
    Sun,
    Globe,
    ShieldCheck,
    Check,
    ChevronRight,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "en", label: "English", flag: "🇺🇸" },
];

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const { lang, setLang } = useTranslation();

    return (
        <main className="max-w-2xl mx-auto pt-20 px-6 pb-20">
            <h1 className="text-3xl font-black mb-8 tracking-tight">
                Sozlamalar
            </h1>

            <div className="space-y-4">
                <div
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="flex items-center justify-between p-6 bg-card border border-border rounded-[24px] hover:bg-accent/50 cursor-pointer transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {theme === "dark" ? (
                                <Moon size={24} />
                            ) : (
                                <Sun size={24} />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-lg">Tungi rejim</p>
                            <p className="text-sm text-muted-foreground">
                                Hozirgi holat:{" "}
                                {theme === "dark" ? "Yoqilgan" : "O'chirilgan"}
                            </p>
                        </div>
                    </div>
                    <div className="w-12 h-6 bg-muted rounded-full relative p-1 transition-colors">
                        <div
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${theme === "dark" ? "translate-x-6 bg-primary" : "translate-x-0 bg-foreground/40"}`}
                        />
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-between p-6 bg-card border border-border rounded-[24px] hover:bg-accent/50 cursor-pointer transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">
                                        Til (Language)
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Tanlangan:{" "}
                                        {
                                            languages.find(
                                                (l) => l.code === lang,
                                            )?.label
                                        }
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="text-muted-foreground" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="rounded-2xl min-w-50 p-2"
                    >
                        {languages.map((l) => (
                            <DropdownMenuItem
                                key={l.code}
                                className="flex items-center justify-between p-3 cursor-pointer rounded-xl"
                                onClick={() => setLang(l.code as Language)}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-xl">{l.flag}</span>
                                    <span className="font-medium">
                                        {l.label}
                                    </span>
                                </span>
                                {lang === l.code && (
                                    <Check size={18} className="text-primary" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center justify-between p-6 bg-card border border-border rounded-[24px] hover:bg-accent/50 cursor-pointer transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Xavfsizlik</p>
                            <p className="text-sm text-muted-foreground">
                                Parol va sessiyalarni boshqarish
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="text-muted-foreground" />
                </div>
            </div>

            <p className="mt-12 text-center text-xs text-muted-foreground">
                Tiyin.uz v1.0.0 • @e_halikov tomonidan yaratilgan
            </p>
        </main>
    );
}
