"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, ExternalLink, ArrowRight } from "lucide-react";

interface NewsItem {
    id: number;
    headline: string;
    category: string;
    datetime: number;
    image: string;
    summary: string;
    url: string;
}

export function LiveNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const apiKey = process.env.NEXT_PUBLIC_FINHUB_API_KEY;
            if (!apiKey) {
                setError("API Key topilmadi!");
                setLoading(false);
                return;
            }
            const response = await fetch(
                `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`,
                { cache: "no-store" },
            );
            const data = await response.json();
            if (Array.isArray(data)) {
                const filtered = data
                    .filter(
                        (item) =>
                            item.headline &&
                            item.image &&
                            item.image.startsWith("http"),
                    )
                    .slice(0, 4);
                setNews(filtered);
            }
        } catch (err: any) {
            setError("Xatolik");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    if (loading && news.length === 0)
        return (
            <div className="w-full py-20 text-center font-black uppercase tracking-[0.3em] text-xs animate-pulse">
                Ma'lumotlar yuklanmoqda...
            </div>
        );

    return (
        <div className="w-full py-12 px-4">
            {/* Header qismi */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Zap className="w-7 h-7 text-primary fill-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                            Yangiliklar
                        </h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Live Market Feed
                        </p>
                    </div>
                </div>
                <div className="h-px flex-1 mx-10 bg-border hidden lg:block" />
            </div>

            {/* Grid faqat kartalar uchun */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <AnimatePresence mode="popLayout">
                    {news.map((item, idx) => (
                        <motion.a
                            key={item.id || idx}
                            href={item.url}
                            target="_blank"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group flex flex-col rounded-[40px] bg-card border border-border/60 hover:border-primary/40 transition-all duration-500 overflow-hidden h-full shadow-sm"
                        >
                            <div className="relative h-44 w-full overflow-hidden">
                                <img
                                    src={item.image}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <span className="absolute top-4 left-4 text-[9px] font-black uppercase bg-primary px-3 py-1.5 rounded-xl text-white">
                                    {item.category}
                                </span>
                            </div>
                            <div className="p-7 flex flex-col flex-1">
                                <h3 className="text-base font-bold leading-tight mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                                    {item.headline}
                                </h3>
                                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" /> LIVE
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </AnimatePresence>
            </div>

            {/* TUGMA ENDI GRID VA ANIMATEPRESENCE DAN TASHQARIDA */}
            <div className="flex justify-center w-full mt-16 relative z-10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/news")}
                    className="flex items-center gap-5 px-12 py-5 rounded-[28px] bg-foreground text-background dark:bg-white dark:text-black font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 pointer-events-auto cursor-pointer"
                >
                    Barcha yangiliklar
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </motion.button>
            </div>
        </div>
    );
}
