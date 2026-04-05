"use client";
import React from "react";
import { motion } from "framer-motion";
import { Heart, Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations("Footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto py-8 border-t border-border/40">
            <div className="flex px-4 md:px-35 flex-col md:flex-row items-center justify-between gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-[10px] font-black text-primary">
                            EA
                        </span>
                    </div>
                    <p className="text-[11px] font-bold tracking-tight">
                        © {currentYear}{" "}
                        <span className="text-foreground">Eldor Halikov</span>.
                        {t("rights")}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span>{t("createdWith")}</span>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Heart className="w-3 h-3 text-destructive fill-destructive" />
                    </motion.div>
                    <span>{t("byUser")}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        target="_blank"
                        href="https://github.com/MCduck-eli"
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <Github className="w-4 h-4" />
                    </Link>
                    <Link
                        href="https://www.instagram.com/eldor.halikov/"
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <Instagram className="w-4 h-4" />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/eldorjon-abdukholikov/?locale=ru"
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <Linkedin className="w-4 h-4" />
                    </Link>
                </div>
            </div>
            <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-border/50 to-transparent" />
        </footer>
    );
}
