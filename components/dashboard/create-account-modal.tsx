"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CURRENCIES = [
    { code: "UZS", symbol: "so'm" },
    { code: "USD", symbol: "$" },
    { code: "RUB", symbol: "₽" },
];

interface CreateAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { balance: number; currency: string }) => void;
}

export function CreateAccountModal({
    isOpen,
    onClose,
    onSave,
}: CreateAccountProps) {
    const [balance, setBalance] = useState("");
    const [currency, setCurrency] = useState("UZS");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!balance) return;
        onSave({ balance: parseFloat(balance), currency });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] bg-background/60 backdrop-blur-xl flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 10 }}
                        className="bg-card border border-border w-full max-w-md rounded-[32px] shadow-2xl p-8 relative overflow-hidden"
                    >
                        {/* Header qismi - ixchamroq */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                <Coins className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight mb-1">
                                Hisobni sozlash
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                Balans va valyutani tanlang.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Valyuta tanlash - zamonaviy tab ko'rinishida */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    Valyuta
                                </label>
                                <div className="grid grid-cols-3 gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
                                    {CURRENCIES.map((c) => (
                                        <button
                                            key={c.code}
                                            type="button"
                                            onClick={() => setCurrency(c.code)}
                                            className={`py-3 rounded-xl flex items-center justify-center transition-all ${
                                                currency === c.code
                                                    ? "bg-card text-primary shadow-sm ring-1 ring-border"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <span className="text-sm font-bold">
                                                {c.code}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Balans kiritish - ixchamroq va aniqroq */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    Boshlang'ich mablag'
                                </label>
                                <div className="relative group">
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="h-16 text-3xl font-black bg-muted/20 border-2 border-transparent focus-visible:border-primary/30 focus-visible:ring-0 rounded-2xl px-6 transition-all placeholder:opacity-20"
                                        value={balance}
                                        onChange={(e) =>
                                            setBalance(e.target.value)
                                        }
                                        autoFocus
                                        required
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-lg text-primary/40">
                                        {
                                            CURRENCIES.find(
                                                (c) => c.code === currency,
                                            )?.symbol
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Tugma - ixcham va dinamik */}
                            <Button className="w-full h-14 rounded-2xl text-base font-bold gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.97]">
                                <Check className="w-5 h-5" /> Saqlash
                            </Button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
