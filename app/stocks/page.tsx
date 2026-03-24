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

const API_KEY = process.env.NEXT_PUBLIC_FINHUB_API_KEY;

const BIG_STOCKS = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft", sector: "Technology" },
    { symbol: "GOOGL", name: "Alphabet", sector: "Technology" },
    { symbol: "AMZN", name: "Amazon.com", sector: "Consumer" },
    { symbol: "NVDA", name: "Nvidia", sector: "Semiconductors" },
    { symbol: "META", name: "Meta Platforms", sector: "Technology" },
    { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
    { symbol: "BRK.B", name: "Berkshire", sector: "Financials" },
    { symbol: "V", name: "Visa Inc.", sector: "Financials" },
    { symbol: "JPM", name: "JPMorgan", sector: "Financials" },
    { symbol: "LLY", name: "Eli Lilly", sector: "Healthcare" },
    { symbol: "UNH", name: "UnitedHealth", sector: "Healthcare" },
];

export default function StocksPage() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const router = useRouter();

    const fetchFullMarket = async () => {
        try {
            const results = await Promise.all(
                BIG_STOCKS.map(async (item) => {
                    const res = await fetch(
                        `https://finnhub.io/api/v1/quote?symbol=${item.symbol}&token=${API_KEY}`,
                    );
                    const data = await res.json();
                    return {
                        ...item,
                        price: data.c ?? 0,
                        change: data.d ?? 0,
                        percent: data.dp ?? 0,
                        high: data.h ?? 0,
                        low: data.l ?? 0,
                        up: (data.dp ?? 0) >= 0,
                    };
                }),
            );
            setStocks(results);
            setLoading(false);
        } catch (error) {
            console.error("Market fetch error:", error);
        }
    };

    useEffect(() => {
        fetchFullMarket();
        const interval = setInterval(fetchFullMarket, 60000);
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

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">
                        Bozor yuklanmoqda...
                    </p>
                </div>
            </div>
        );

    return (
        <main className="min-h-screen bg-background pb-20 pt-10 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="p-0 hover:bg-transparent text-muted-foreground hover:text-foreground gap-2 transition-colors mb-2"
                    >
                        <ArrowLeft size={18} /> Orqaga qaytish
                    </Button>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                        U.S. Market <span className="text-primary">Live</span>
                    </h1>
                    <p className="text-sm font-bold opacity-50 uppercase tracking-widest">
                        Amerika fond bozori tahlili
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <Input
                        placeholder="Aksiya qidirish..."
                        className="pl-11 h-12 rounded-2xl bg-card/50 border-border/50 focus:border-primary/50 transition-all font-bold"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStocks.map((stock, idx) => (
                    <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group p-8 rounded-[40px] bg-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <Globe size={160} />
                        </div>

                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase">
                                        {stock.sector}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter leading-none mt-2 uppercase italic">
                                    {stock.symbol}
                                </h3>
                                <p className="text-xs font-bold text-muted-foreground uppercase">
                                    {stock.name}
                                </p>
                            </div>
                            <div
                                className={`p-4 rounded-2xl ${stock.up ? "bg-emerald-500/10" : "bg-destructive/10"}`}
                            >
                                {stock.up ? (
                                    <TrendingUp className="text-emerald-500" />
                                ) : (
                                    <TrendingDown className="text-destructive" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                                        Joriy narx
                                    </p>
                                    <h4 className="text-4xl font-black tabular-nums tracking-tighter">
                                        $
                                        {stock.price.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </h4>
                                </div>
                                <div
                                    className={`text-right ${stock.up ? "text-emerald-500" : "text-destructive"}`}
                                >
                                    <p className="text-xl font-black tracking-tighter">
                                        {stock.up ? "+" : ""}
                                        {stock.percent.toFixed(2)}%
                                    </p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">
                                        O'zgarish
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/30">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase opacity-40">
                                        Kunlik eng yuqori
                                    </p>
                                    <p className="font-mono font-bold text-sm">
                                        ${stock.high.toFixed(2)}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black uppercase opacity-40">
                                        Kunlik eng past
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
                            TAHLIL QILISH <BarChart3 size={16} />
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
