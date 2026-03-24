"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_FINHUB_API_KEY;
const SYMBOLS = ["AAPL", "TSLA", "MSFT", "NVDA"];

interface IStock {
    id: string;
    name: string;
    price: number;
    color: string;
    chart: number[];
}

export default function ChartCard() {
    const [stocks, setStocks] = useState<IStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchStockData = async () => {
        try {
            const results = await Promise.all(
                SYMBOLS.map(async (symbol) => {
                    const quoteRes = await fetch(
                        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
                    );
                    const quoteData = await quoteRes.json();
                    const to = Math.floor(Date.now() / 1000);
                    const from = to - 86400;
                    const candleRes = await fetch(
                        `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=60&from=${from}&to=${to}&token=${API_KEY}`,
                    );
                    const candleData = await candleRes.json();

                    let chartBars: number[] = [];
                    if (candleData.c) {
                        const min = Math.min(...candleData.c);
                        const max = Math.max(...candleData.c);
                        chartBars = candleData.c.map(
                            (val: number) => ((val - min) / (max - min)) * 100,
                        );
                    }

                    return {
                        id: symbol,
                        name:
                            symbol === "AAPL"
                                ? "Apple Inc."
                                : symbol === "TSLA"
                                  ? "Tesla Motors"
                                  : symbol === "MSFT"
                                    ? "Microsoft"
                                    : "Nvidia Corp",
                        price: quoteData.c,
                        color:
                            quoteData.dp >= 0
                                ? "text-emerald-500"
                                : "text-destructive",
                        chart:
                            chartBars.length > 0
                                ? chartBars.slice(-15)
                                : [40, 50, 60, 45, 70, 80],
                    };
                }),
            );
            setStocks(results);
            setIsLoading(false);
        } catch (error) {
            console.error("API Error:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStockData();
        const timer = setInterval(fetchStockData, 60000);
        return () => clearInterval(timer);
    }, []);

    if (isLoading)
        return (
            <div className="w-full flex justify-center py-20 opacity-30">
                <Loader2 className="animate-spin" size={30} />
            </div>
        );

    return (
        <section className="w-full max-w-7xl px-6 mt-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight">
                        Top Aksiyalar
                    </h3>
                </div>
                <Link href={"/stocks"}>
                    <Button
                        variant="outline"
                        className="rounded-full border-border/50 bg-card/50 font-bold gap-2 hover:bg-accent"
                    >
                        Barcha aksiyalar <ArrowUpRight size={16} />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stocks.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="p-6 rounded-[32px] bg-card/40 backdrop-blur-md border border-border/50 shadow-sm hover:border-primary/20 transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    {item.name}
                                </p>
                                <h4 className="text-2xl font-black tabular-nums tracking-tighter">
                                    $
                                    {(item.price ?? 0).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        },
                                    )}
                                </h4>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full bg-muted/50 text-[10px] font-black uppercase tracking-tighter animate-pulse ${
                                    item.color === "text-emerald-500"
                                        ? "text-emerald-500"
                                        : "text-destructive"
                                }`}
                            >
                                ● Live
                            </div>
                        </div>

                        <div className="flex items-end gap-1 h-16 w-full">
                            {item.chart.map((h, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(15, h)}%` }}
                                    transition={{
                                        delay: j * 0.03,
                                        duration: 0.6,
                                    }}
                                    className={`flex-1 rounded-full ${
                                        item.color === "text-emerald-500"
                                            ? "bg-emerald-500/40"
                                            : "bg-destructive/40"
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
