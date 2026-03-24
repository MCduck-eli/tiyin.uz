"use client";

import { motion } from "framer-motion";
import { AlertCircle, TrendingDown } from "lucide-react";

interface CategoryPreviewProps {
    totalBalance: number;
    expenses: any[];
    currencySymbol: string;
}

export function CategoryPreview({
    totalBalance,
    expenses,
    currencySymbol,
}: CategoryPreviewProps) {
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const spendingRatio = totalSpent / (totalBalance || 1);
    const isRunningLow = spendingRatio >= 0.8 && spendingRatio < 1;
    const isOut = spendingRatio >= 1;

    return (
        <div className="space-y-6 w-full">
            {isOut ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive"
                >
                    <AlertCircle className="w-6 h-6 shrink-0 animate-pulse" />
                    <div>
                        <p className="text-xs font-black uppercase tracking-tight">
                            DIQQAT! PULINGIZ TUGADI
                        </p>
                        <p className="text-[10px] font-bold opacity-80 text-foreground">
                            Siz limitdan chiqdingiz. Tejash rejimiga o'ting!
                        </p>
                    </div>
                </motion.div>
            ) : isRunningLow ? (
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3 text-orange-600 dark:text-orange-400"
                >
                    <TrendingDown className="w-6 h-6 shrink-0" />
                    <div>
                        <p className="text-xs font-black uppercase tracking-tight">
                            Mablag' kam qolmoqda
                        </p>
                        <p className="text-[10px] font-bold opacity-80 text-foreground">
                            Balansingizning 80% dan ko'pi sarflandi.
                        </p>
                    </div>
                </motion.div>
            ) : null}
        </div>
    );
}
