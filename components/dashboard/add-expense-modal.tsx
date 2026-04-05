"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Banknote, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AddExpenseProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (expense: any) => void;
}

export function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseProps) {
    const t = useTranslations("AddExpense");
    const CATEGORIES = useMemo(
        () => [
            { id: "food", name: t("categories.food"), icon: "🍱" },
            { id: "transport", name: t("categories.transport"), icon: "壓" },
            { id: "clothing", name: t("categories.clothing"), icon: "👕" },
            { id: "household", name: t("categories.household"), icon: "🏠" },
            {
                id: "entertainment",
                name: t("categories.entertainment"),
                icon: "🎮",
            },
            { id: "other", name: t("categories.other"), icon: "✨" },
        ],
        [t],
    );

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("food");
    const [note, setNote] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;
        const selectedCat = CATEGORIES.find((c) => c.id === category);

        onAdd({
            amount: parseFloat(amount),
            category: selectedCat?.name || category,
            note,
            date: new Date().toISOString(),
        });
        setAmount("");
        setNote("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-200 flex justify-end overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 220,
                        }}
                        className="relative w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-[[-20px_0_60px_-15px_rgba(0,0,0,0.3)]]"
                    >
                        <div className="relative z-10 flex-1 flex flex-col p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-foreground">
                                        {t("title")}
                                    </h2>
                                    <p className="text-muted-foreground text-xs font-medium">
                                        {t("subtitle")}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="rounded-full bg-muted/50 hover:bg-muted"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 flex-1 flex flex-col"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        {t("amountLabel")}
                                    </label>
                                    <div className="group relative">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            className="w-full bg-muted/40 border-b-2 border-transparent focus:border-primary rounded-xl h-20 text-4xl font-black text-center transition-all outline-none"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        {t("categoryLabel")}
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() =>
                                                    setCategory(cat.id)
                                                }
                                                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${
                                                    category === cat.id
                                                        ? "bg-card border-primary"
                                                        : "bg-muted/30 border-transparent hover:border-border/60"
                                                }`}
                                            >
                                                <span>{cat.icon}</span>
                                                <span
                                                    className={`text-xs font-bold ${category === cat.id ? "text-primary" : "text-foreground"}`}
                                                >
                                                    {cat.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        {t("noteLabel")}
                                    </label>
                                    <div className="relative group">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                        <input
                                            value={note}
                                            onChange={(e) =>
                                                setNote(e.target.value)
                                            }
                                            placeholder={t("notePlaceholder")}
                                            className="w-full h-12 pl-11 pr-5 bg-muted/40 border-b-2 border-transparent focus:border-primary rounded-lg text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-auto pt-8">
                                    <Button className="w-full h-16 rounded-2xl text-lg font-black gap-3 group">
                                        {t("submitBtn")}{" "}
                                        <CornerDownLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
