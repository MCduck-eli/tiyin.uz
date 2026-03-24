"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINHUB_API_KEY;

const SYMBOLS = [
    "AAPL",
    "MSFT",
    "NVDA",
    "TSLA",
    "GOOGL",
    "AMZN",
    "META",
    "BINANCE:BTCUSDT",
];

export function StockTicker() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStockData = async () => {
        try {
            const promises = SYMBOLS.map(async (symbol) => {
                const res = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
                );
                const data = await res.json();
                return {
                    symbol: symbol.replace("BINANCE:", ""),
                    price: data.c || 0,
                    change:
                        (data.dp >= 0 ? "+" : "") +
                        (data.dp?.toFixed(2) || "0.00") +
                        "%",
                    up: data.dp >= 0,
                    name: symbol.split(":")[0],
                };
            });

            const results = await Promise.all(promises);
            setStocks(results);
            setLoading(false);
        } catch (error) {
            console.error("Stock fetch error:", error);
        }
    };

    useEffect(() => {
        fetchStockData();
        const interval = setInterval(fetchStockData, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading)
        return (
            <div className="h-20 flex items-center justify-center opacity-20">
                <Loader2 className="animate-spin" />
            </div>
        );

    return (
        <div className="py-8 overflow-hidden bg-background/50 border-y border-border/50 backdrop-blur-sm">
            <div className="relative flex overflow-hidden w-300">
                <motion.div
                    className="flex gap-12 items-center whitespace-nowrap"
                    animate={{ x: [0, -2000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 50,
                            ease: "linear",
                        },
                    }}
                >
                    {[...stocks, ...stocks, ...stocks, ...stocks].map(
                        (stock, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 px-4 py-2 rounded-2xl hover:bg-muted/50 transition-colors cursor-default"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold tracking-wider">
                                        {stock.symbol}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase">
                                        Market Live
                                    </span>
                                </div>

                                <div className="flex flex-col items-end min-w-[100px]">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={stock.price}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-sm font-mono font-medium"
                                        >
                                            $
                                            {stock.price.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}
                                        </motion.span>
                                    </AnimatePresence>
                                    <div
                                        className={`flex items-center gap-1 text-[11px] font-bold transition-colors duration-500 ${stock.up ? "text-emerald-500" : "text-destructive"}`}
                                    >
                                        {stock.up ? (
                                            <TrendingUp className="w-3 h-3" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3" />
                                        )}
                                        {stock.change}
                                    </div>
                                </div>
                            </div>
                        ),
                    )}
                </motion.div>
            </div>
        </div>
    );
}
