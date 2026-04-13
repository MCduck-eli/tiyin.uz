"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Search,
    BarChart3,
    Globe,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { AnalysisModal } from "@/components/stocks/analysis-modal";
import { useTranslations } from "next-intl";
import { fetchFullMarket } from "./data-stock";

export default function StocksPage() {
    const t = useTranslations("StocksPage");
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // 1. Ma'lumotni yuklash (argumentlar bilan)
        fetchFullMarket(setStocks, setLoading);

        // 2. Intervalni to'g'ri o'rnatish
        const interval = setInterval(() => {
            fetchFullMarket(setStocks, setLoading);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const filteredStocks = stocks.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleAnalyze = (symbol: string) => {
        setSelectedSymbol(symbol);
        setIsAnalysisOpen(true);
    };

    if (loading && stocks.length === 0)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">
                        {t("loading")}
                    </p>
                </div>
            </div>
        );

    return (
        <main className="min-h-screen bg-background pb-20 pt-10 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="p-0 hover:bg-transparent text-muted-foreground hover:text-foreground gap-2 transition-colors mb-2"
                    >
                        <ArrowLeft size={18} /> {t("back")}
                    </Button>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic">
                        U.S. Market <span className="text-primary">Live</span>
                    </h1>
                    <p className="text-[10px] sm:text-sm font-bold opacity-50 uppercase tracking-widest">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <Input
                        placeholder={t("searchPlaceholder")}
                        className="pl-11 h-12 rounded-2xl bg-card/50 border-border/50 focus:border-primary/50 transition-all font-bold"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStocks.map((stock, idx) => (
                    <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -8, scale: 1.01 }}
                        className="group p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <Globe size={160} />
                        </div>

                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase">
                                    {t(`sectors.${stock.sector}`)}
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter leading-none mt-2 uppercase italic">
                                    {stock.symbol}
                                </h3>
                                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase truncate max-w-[150px]">
                                    {stock.name}
                                </p>
                            </div>
                            <div
                                className={`p-3 sm:p-4 rounded-2xl ${stock.up ? "bg-emerald-500/10" : "bg-destructive/10"}`}
                            >
                                {stock.up ? (
                                    <TrendingUp className="text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
                                ) : (
                                    <TrendingDown className="text-destructive w-5 h-5 sm:w-6 sm:h-6" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                                        {t("currentPrice")}
                                    </p>
                                    <h4 className="text-3xl sm:text-4xl font-black tabular-nums tracking-tighter">
                                        $
                                        {stock.price.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </h4>
                                </div>
                                <div
                                    className={`text-right ${stock.up ? "text-emerald-500" : "text-destructive"}`}
                                >
                                    <p className="text-lg sm:text-xl font-black tracking-tighter">
                                        {stock.up ? "+" : ""}
                                        {stock.percent.toFixed(2)}%
                                    </p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">
                                        {t("change")}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/30">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase opacity-40">
                                        {t("high")}
                                    </p>
                                    <p className="font-mono font-bold text-sm">
                                        ${stock.high.toFixed(2)}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black uppercase opacity-40">
                                        {t("low")}
                                    </p>
                                    <p className="font-mono font-bold text-sm">
                                        ${stock.low.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleAnalyze(stock.symbol)}
                            className="w-full mt-8 rounded-2xl h-12 font-black gap-2 group-hover:bg-primary transition-all"
                        >
                            {t("analyzeBtn")} <BarChart3 size={16} />
                        </Button>
                    </motion.div>
                ))}
            </div>

            <AnalysisModal
                symbol={selectedSymbol}
                isOpen={isAnalysisOpen}
                onClose={() => setIsAnalysisOpen(false)}
            />
        </main>
    );
}
