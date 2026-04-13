"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { fetchStockData } from "./chart-base";

interface IStock {
    id: string;
    name: string;
    price: number;
    color: string;
    chart: number[];
}

export default function ChartCard() {
    const t = useTranslations("ChartCard");
    const [stocks, setStocks] = useState<IStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchStockData(setStocks, setIsLoading);
        const timer = setInterval(() => {
            fetchStockData(setStocks, setIsLoading);
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    if (isLoading)
        return (
            <div className="w-full flex justify-center py-20 opacity-30">
                <Loader2 className="animate-spin" size={30} />
            </div>
        );

    return (
        <section className="w-full max-w-7xl px-4 sm:px-6 mt-8 sm:mt-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tight">
                        {t("title")}
                    </h3>
                </div>
                <Link href={"/stocks"}>
                    <Button
                        variant="outline"
                        className="rounded-full border-border/50 bg-card/50 font-bold gap-2 hover:bg-accent h-9 sm:h-10 text-xs sm:text-sm"
                    >
                        {t("viewAll")} <ArrowUpRight size={16} />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                {stocks.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] bg-card/40 backdrop-blur-md border border-border/50 shadow-sm hover:border-primary/20 transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    {item.name}
                                </p>
                                <h4 className="text-xl sm:text-2xl font-black tabular-nums tracking-tighter">
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
                                className={`px-2.5 py-1 rounded-full bg-muted/50 text-[9px] sm:text-[10px] font-black uppercase tracking-tighter animate-pulse shrink-0 ${
                                    item.color === "text-emerald-500"
                                        ? "text-emerald-500"
                                        : "text-destructive"
                                }`}
                            >
                                ● {t("live")}
                            </div>
                        </div>

                        <div className="flex items-end gap-1 h-14 sm:h-16 w-full">
                            {item.chart.map((h, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(15, h)}%` }}
                                    transition={{
                                        delay: j * 0.02,
                                        duration: 0.5,
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
