"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface UserStats {
    balance: number;
    currency: string;
}

interface MaqsadProps {
    userStats: UserStats;
    monthlyTotal: number;
    getCurrencySymbol: (currency: string) => string;
}

export default function MaqsadCard({
    userStats,
    monthlyTotal,
    getCurrencySymbol,
}: MaqsadProps) {
    const navigate = useRouter();
    const goalAnalysis = useMemo(() => {
        const income = userStats.balance;
        const expenses = monthlyTotal;
        const savings = income - expenses;
        const rate = income > 0 ? (savings / income) * 100 : 0;

        let status = {
            label: "Stabil",
            message: "Xarajatlaringiz me'yorda. Reja bo'yicha davom eting.",
            color: "text-blue-500",
            bg: "bg-blue-500",
        };

        if (rate > 30) {
            status = {
                label: "Tezkor",
                message:
                    "Ajoyib! Siz maqsad sari juda tez ilgarilayapsiz. Shunday davom eting!",
                color: "text-emerald-500",
                bg: "bg-emerald-500",
            };
        } else if (rate < 10 && rate > 0) {
            status = {
                label: "Sekin",
                message:
                    "Diqqat! Xarajatlar ko'paygan. Maqsadga erishish muddati uzayishi mumkin.",
                color: "text-orange-500",
                bg: "bg-orange-500",
            };
        } else if (savings <= 0) {
            status = {
                label: "Xavfli",
                message:
                    "Xavf! Siz daromadingizdan ko'p xarajat qilyapsiz. Maqsad xavf ostida!",
                color: "text-destructive",
                bg: "bg-destructive",
            };
        }

        return { rate: Math.max(0, rate), ...status, savings };
    }, [monthlyTotal, userStats.balance]);
    return (
        <div className="mt-4 mb-10">
            <Card className="p-8 rounded-[40px] border-primary/20 bg-card shadow-2xl overflow-hidden relative border-2">
                <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                    <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                    Live Progress
                                </div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">
                                    Maqsad Sari
                                </h3>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`text-5xl font-black ${goalAnalysis.color}`}
                                >
                                    {Math.round(goalAnalysis.rate)}%
                                </span>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    Oylik Jamg'arma
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Progress
                                value={goalAnalysis.rate}
                                className="h-4 rounded-full bg-muted"
                            />
                            <div className="flex justify-between text-[11px] font-bold opacity-60 uppercase tracking-tighter">
                                <span>
                                    Sarflandi: {monthlyTotal.toLocaleString()}
                                </span>
                                <span>
                                    Erkin:{" "}
                                    {goalAnalysis.savings.toLocaleString()}{" "}
                                    {getCurrencySymbol(userStats.currency)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center border-l border-border/50 pl-0 lg:pl-10">
                        <div className="bg-accent/40 p-6 rounded-[32px] border border-border/50 relative backdrop-blur-sm">
                            <div
                                className={`absolute -top-3 -left-3 w-10 h-10 ${goalAnalysis.bg} rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12`}
                            >
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                    AI Counselor{" "}
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </h4>
                                <span
                                    className={`text-[10px] font-black px-2 py-0.5 rounded-md ${goalAnalysis.bg} text-white uppercase`}
                                >
                                    {goalAnalysis.label}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed font-semibold italic opacity-90 text-foreground/80">
                                "{goalAnalysis.message}"
                            </p>

                            <div className="mt-5 flex items-center justify-between">
                                <Button
                                    onClick={() => navigate.push("/goals")}
                                    className="rounded-2xl font-black text-xs px-6 h-10 bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                >
                                    REJANI KO'RISH{" "}
                                    <ArrowUpRight size={14} className="ml-1" />
                                </Button>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black opacity-40 uppercase">
                                        Status
                                    </span>
                                    <span
                                        className={`text-xs font-black uppercase ${goalAnalysis.color}`}
                                    >
                                        {goalAnalysis.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-16 -right-16 opacity-[0.03] pointer-events-none select-none">
                    <Target size={300} />
                </div>
            </Card>
        </div>
    );
}
