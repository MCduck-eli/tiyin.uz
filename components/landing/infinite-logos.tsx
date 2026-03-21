"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const INITIAL_STOCKS = [
    {
        symbol: "AAPL",
        name: "Apple",
        price: 182.63,
        change: "+1.23%",
        up: true,
    },
    {
        symbol: "MSFT",
        name: "Microsoft",
        price: 402.12,
        change: "+0.85%",
        up: true,
    },
    {
        symbol: "NVDA",
        name: "Nvidia",
        price: 726.13,
        change: "-2.15%",
        up: false,
    },
    {
        symbol: "TSLA",
        name: "Tesla",
        price: 193.57,
        change: "-1.42%",
        up: false,
    },
    {
        symbol: "GOOGL",
        name: "Google",
        price: 145.2,
        change: "+0.45%",
        up: true,
    },
    {
        symbol: "AMZN",
        name: "Amazon",
        price: 174.45,
        change: "+1.10%",
        up: true,
    },
    {
        symbol: "META",
        name: "Meta",
        price: 485.23,
        change: "-0.32%",
        up: false,
    },
    {
        symbol: "BTC",
        name: "Bitcoin",
        price: 64231.0,
        change: "+4.12%",
        up: true,
    },
];

export function StockTicker() {
    const [stocks, setStocks] = useState(INITIAL_STOCKS);

    useEffect(() => {
        const interval = setInterval(() => {
            setStocks((prevStocks) =>
                prevStocks.map((stock) => {
                    const volatility = (Math.random() - 0.5) * 0.5;
                    const newPrice = Math.max(0.01, stock.price + volatility);
                    const currentChange = (
                        (volatility / stock.price) *
                        100
                    ).toFixed(2);

                    return {
                        ...stock,
                        price: newPrice,
                        change:
                            (parseFloat(currentChange) >= 0 ? "+" : "") +
                            currentChange +
                            "%",
                        up: volatility >= 0,
                    };
                }),
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="py-8 overflow-hidden bg-background/50 border-y border-border/50 backdrop-blur-sm">
            <div className="relative flex w-full overflow-hidden">
                <motion.div
                    className="flex gap-12 items-center whitespace-nowrap"
                    animate={{ x: [0, -1500] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {[...stocks, ...stocks, ...stocks].map((stock, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 px-4 py-2 rounded-2xl hover:bg-muted/50 transition-colors cursor-default"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-wider">
                                    {stock.symbol}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase">
                                    {stock.name}
                                </span>
                            </div>

                            <div className="flex flex-col items-end min-w-[80px]">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={stock.price}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm font-mono font-medium"
                                    >
                                        $
                                        {stock.price.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
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
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
