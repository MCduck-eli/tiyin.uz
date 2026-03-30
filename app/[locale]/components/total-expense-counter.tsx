"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, CreditCard } from "lucide-react";

interface TotalExpenseCounterProps {
    expenses: any[];
    currencySymbol: string;
}

export function TotalExpenseCounter({
    expenses,
    currencySymbol,
}: TotalExpenseCounterProps) {
    const monthlyTotalSpent = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses
            .filter((exp) => {
                const expDate = new Date(exp.date);
                return (
                    expDate.getMonth() === currentMonth &&
                    expDate.getFullYear() === currentYear
                );
            })
            .reduce((sum, item) => sum + item.amount, 0);
    }, [expenses]);
    const monthlyCount = useMemo(() => {
        const now = new Date();
        return expenses.filter((exp) => {
            const expDate = new Date(exp.date);
            return (
                expDate.getMonth() === now.getMonth() &&
                expDate.getFullYear() === now.getFullYear()
            );
        }).length;
    }, [expenses]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden group p-6 rounded-[32px] bg-card border border-border shadow-sm flex items-center justify-between"
        >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-destructive/5 blur-3xl rounded-full group-hover:bg-destructive/10 transition-colors" />

            <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20 shadow-inner">
                    <TrendingDown className="w-7 h-7 text-destructive" />
                </div>

                <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                        Bu oydagi sarf-xarajat
                    </p>
                    <div className="flex items-baseline gap-1.5">
                        <motion.h2
                            key={monthlyTotalSpent}
                            initial={{ opacity: 0, filter: "blur(4px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            className="text-3xl font-black tracking-tighter tabular-nums"
                        >
                            {monthlyTotalSpent.toLocaleString()}
                        </motion.h2>
                        <span className="text-sm font-bold text-muted-foreground uppercase">
                            {currencySymbol}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end relative z-10">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-foreground">
                        {monthlyCount} ta operatsiya
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
