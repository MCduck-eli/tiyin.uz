"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    ArrowLeft,
    Clock,
    Zap,
    Search,
    Newspaper,
    ChevronRight,
    LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface NewsItem {
    id: number;
    headline: string;
    category: string;
    datetime: number;
    image: string;
    summary: string;
    url: string;
}

export default function AllNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const router = useRouter();

    const fetchAllNews = useCallback(async () => {
        setLoading(true);
        try {
            const apiKey = process.env.NEXT_PUBLIC_FINHUB_API_KEY;
            if (!apiKey) return;
            const response = await fetch(
                `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`,
                { cache: "no-store" },
            );
            const data = await response.json();
            if (Array.isArray(data)) setNews(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllNews();
    }, [fetchAllNews]);

    const filteredNews = news.filter(
        (item) =>
            item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
                />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300">
            <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all font-bold text-[10px] uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Orqaga
                    </button>

                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Jonli Yangiliklar
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-20">
                <header className="relative mb-24">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.4em]"
                            >
                                <LayoutGrid className="w-4 h-4" /> Global
                                Intelligence
                            </motion.div>
                            <h1 className="text-7xl md:text-9xl font-black tracking-[-0.05em] leading-[0.85] uppercase italic">
                                Tiyin
                                <br />
                                <span className="text-primary not-italic">
                                    Insight.
                                </span>
                            </h1>
                        </div>

                        <div className="w-full lg:w-112.5 space-y-8">
                            <p className="text-muted-foreground font-medium leading-relaxed text-sm border-l border-border pl-6">
                                Professional darajadagi moliya tahlillari va
                                real vaqt rejimidagi bozor o'zgarishlari.
                            </p>
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Kalit so'z..."
                                    className="w-full bg-muted/30 border border-border rounded-2xl py-5 pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-background transition-all"
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredNews.map((item, idx) => (
                            <motion.a
                                key={item.id || idx}
                                href={item.url}
                                target="_blank"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: idx * 0.05,
                                }}
                                className="group flex flex-col bg-card hover:bg-accent/50 rounded-[32px] border border-border p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20"
                            >
                                <div className="relative aspect-16/10 rounded-[24px] overflow-hidden mb-8">
                                    <img
                                        src={
                                            item.image ||
                                            "https://images.unsplash.com/photo-1611974717483-582807ca633f"
                                        }
                                        alt=""
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute top-5 left-5">
                                        <span className="px-4 py-2 rounded-xl bg-background/60 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-foreground border border-border">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 px-2">
                                    <div className="flex items-center gap-3 mb-5">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            {new Date(
                                                item.datetime * 1000,
                                            ).toLocaleDateString("uz-UZ", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4 uppercase italic">
                                        {item.headline}
                                    </h3>

                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-8 font-medium">
                                        {item.summary}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-border">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                            Batafsil
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white dark:group-hover:text-black transition-all shadow-sm">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </AnimatePresence>
                </div>

                {!loading && filteredNews.length === 0 && (
                    <div className="py-40 text-center">
                        <Newspaper className="w-12 h-12 text-muted mx-auto mb-6 opacity-20" />
                        <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">
                            Ma'lumot topilmadi
                        </h3>
                    </div>
                )}
            </div>

            <footer className="mt-40 py-20 border-t border-border bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary fill-primary" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                            Tiyin Ekotizimi
                        </p>
                    </div>
                    <div className="flex gap-12 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                        <span>© 2026 Global Intelligence</span>
                        <span className="hover:text-primary transition-colors cursor-pointer">
                            Maxfiylik
                        </span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
