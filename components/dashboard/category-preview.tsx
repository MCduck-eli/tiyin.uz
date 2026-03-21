"use client";

import { motion } from "framer-motion";

const categories = [
    {
        name: "Ovqatlanish",
        spent: 1800000,
        limit: 2000000,
        color: "bg-emerald-500",
    },
    {
        name: "Kiyim-kechak",
        spent: 1200000,
        limit: 1000000,
        color: "bg-destructive",
    }, // Limit oshgan
    { name: "Transport", spent: 450000, limit: 600000, color: "bg-blue-500" },
];

export function CategoryPreview() {
    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {categories.map((cat, i) => {
                const percent = Math.min(100, (cat.spent / cat.limit) * 100);
                const isOver = cat.spent > cat.limit;

                return (
                    <div
                        key={i}
                        className="p-4 rounded-2xl bg-muted/20 border border-border/50"
                    >
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span>{cat.name}</span>
                            <span className={isOver ? "text-destructive" : ""}>
                                {cat.spent.toLocaleString()} /{" "}
                                {cat.limit.toLocaleString()} so'm
                            </span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                className={`h-full ${isOver ? "bg-destructive" : cat.color}`}
                            />
                        </div>
                        {isOver && (
                            <p className="text-[10px] text-destructive mt-1 font-bold animate-bounce">
                                ⚠️ Diqqat! Limitdan oshib ketdingiz!
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
