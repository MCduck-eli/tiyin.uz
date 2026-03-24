"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Banknote, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
    { name: "Ovqat", icon: "🍱" },
    { name: "Transport", icon: "🚕" },
    { name: "Kiyim", icon: "👕" },
    { name: "Uy-ro'zg'or", icon: "🏠" },
    { name: "Ko'ngilochar", icon: "🎮" },
    { name: "Boshqa", icon: "✨" },
];

interface AddExpenseProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (expense: any) => void;
}

export function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseProps) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Ovqat");
    const [note, setNote] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;
        onAdd({
            amount: parseFloat(amount),
            category,
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
                <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
                    {/* Backdrop */}
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
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />

                        <div className="relative z-10 flex-1 flex flex-col p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-foreground">
                                        Yangi xarajat
                                    </h2>
                                    <p className="text-muted-foreground text-xs font-medium">
                                        Pulni tejashni unutmang
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="rounded-full bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 flex-1 flex flex-col"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            Summa
                                        </label>
                                        <Banknote className="w-3.5 h-3.5 text-primary/40" />
                                    </div>
                                    <div className="group relative">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            className="w-full bg-muted/40 border-b-2 border-transparent focus:border-primary rounded-xl h-20 text-4xl font-black text-center transition-all outline-none placeholder:opacity-20 tabular-nums hover:bg-muted/60"
                                            autoFocus
                                            required
                                        />
                                        <div className="absolute bottom-3 right-5 text-xs font-bold text-muted-foreground opacity-60">
                                            UZS
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
                                        Kategoriya
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.name}
                                                type="button"
                                                onClick={() =>
                                                    setCategory(cat.name)
                                                }
                                                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200 ${
                                                    category === cat.name
                                                        ? "bg-card border-primary shadow-[0_5px_15px_-3px_rgba(var(--primary),0.2)]"
                                                        : "bg-muted/30 border-transparent hover:border-border/60 hover:bg-muted/50"
                                                }`}
                                            >
                                                <span className="text-lg">
                                                    {cat.icon}
                                                </span>
                                                <span
                                                    className={`text-xs font-bold ${category === cat.name ? "text-primary" : "text-foreground"}`}
                                                >
                                                    {cat.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
                                        Izoh (ixtiyoriy)
                                    </label>
                                    <div className="relative group">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                                        <input
                                            value={note}
                                            onChange={(e) =>
                                                setNote(e.target.value)
                                            }
                                            placeholder="Nima xarid qildingiz?"
                                            className="w-full h-12 pl-11 pr-5 bg-muted/40 border-b-2 border-transparent focus:border-primary rounded-lg text-sm font-medium transition-all outline-none group-hover:bg-muted/60"
                                        />
                                    </div>
                                </div>
                                <div className="mt-auto pt-8">
                                    <Button className="w-full h-16 rounded-2xl text-lg font-black gap-3 shadow-[0_15px_30px_-8px_rgba(var(--primary),0.3)] transition-all active:scale-[0.98] group">
                                        Qo'shish{" "}
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
