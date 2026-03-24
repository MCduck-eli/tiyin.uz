"use client";

import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Globe,
    Building2,
    DollarSign,
    PieChart,
    Cpu,
    Info,
    Loader2,
    Sparkles,
} from "lucide-react";

interface AnalysisModalProps {
    symbol: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const API_KEY = process.env.NEXT_PUBLIC_FINHUB_API_KEY;

export function AnalysisModal({ symbol, isOpen, onClose }: AnalysisModalProps) {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        if (symbol && isOpen) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const res = await fetch(
                        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`,
                    );
                    const data = await res.json();
                    const resMetric = await fetch(
                        `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`,
                    );
                    const metricData = await resMetric.json();

                    setDetails({ ...data, metrics: metricData.metric });
                } catch (error) {
                    console.error("AI Analysis Error:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [symbol, isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-xl border-l-border/50 bg-background/95 backdrop-blur-2xl p-0">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary w-8 h-8" />
                    </div>
                ) : details ? (
                    <ScrollArea className="h-full p-8">
                        <SheetHeader className="mb-8">
                            <div className="flex items-center gap-3 mb-2 text-primary">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <span className="text-primary-foreground font-bold text-sm">
                                        T
                                    </span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                    AI Counselor Analysis
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-4xl font-black italic uppercase tracking-tighter">
                                    {details.name}
                                </SheetTitle>
                                {details.logo && (
                                    <img
                                        src={details.logo}
                                        alt="logo"
                                        className="w-12 h-12 rounded-xl border p-1 bg-white"
                                    />
                                )}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Badge
                                    variant="secondary"
                                    className="rounded-full font-bold"
                                >
                                    {details.ticker}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="rounded-full font-bold"
                                >
                                    {details.finnhubIndustry}
                                </Badge>
                            </div>
                        </SheetHeader>

                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-black uppercase opacity-40">
                                    <Info size={14} /> Kompaniya haqida
                                </h4>
                                <p className="text-sm font-medium leading-relaxed opacity-80 italic">
                                    {details.name} — {details.finnhubIndustry}{" "}
                                    sohasidagi gigant kompaniya bo'lib, uning
                                    bozor qiymati (Market Cap){" "}
                                    {Math.round(
                                        details.marketCapitalization / 1000,
                                    )}{" "}
                                    mlrd dollarni tashkil etadi. Kompaniya{" "}
                                    {details.country} davlatida ro'yxatdan
                                    o'tgan.
                                </p>
                            </section>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[10px] font-black uppercase opacity-50 mb-1">
                                        Bozor Qiymati
                                    </p>
                                    <p className="text-xl font-black tabular-nums">
                                        $
                                        {(
                                            details.marketCapitalization / 1000
                                        ).toFixed(1)}
                                        B
                                    </p>
                                </div>
                                <div className="p-4 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                                    <p className="text-[10px] font-black uppercase opacity-50 mb-1">
                                        Valyuta
                                    </p>
                                    <p className="text-xl font-black">
                                        {details.currency}
                                    </p>
                                </div>
                            </div>
                            <section className="p-6 rounded-[32px] bg-primary/10 border border-primary/20 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
                                        <PieChart size={14} /> Ekspert Tahlili
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60">
                                                52 haftalik eng yuqori:
                                            </span>
                                            <span className="font-bold">
                                                $
                                                {
                                                    details.metrics?.[
                                                        "52WeekHigh"
                                                    ]
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60">
                                                52 haftalik eng past:
                                            </span>
                                            <span className="font-bold">
                                                $
                                                {details.metrics?.["52WeekLow"]}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60">
                                                P/E Ratio:
                                            </span>
                                            <span className="font-bold text-primary">
                                                {details.metrics?.peBasicExclExtra?.toFixed(
                                                    2,
                                                ) || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="flex flex-col gap-3 pt-4">
                                <a
                                    href={details.weburl}
                                    target="_blank"
                                    className="flex items-center gap-3 text-xs font-bold hover:text-primary transition-colors"
                                >
                                    <Globe size={14} /> Rasmiy veb-sayt
                                </a>
                                <div className="flex items-center gap-3 text-xs font-bold opacity-60">
                                    <Building2 size={14} /> IPO Sanasi:{" "}
                                    {details.ipo}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="p-10 text-center opacity-40 uppercase text-xs font-black">
                        Ma'lumot topilmadi
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
