"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Pencil,
    Trash2,
    Plus,
    Loader2,
    AlertCircle,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SalaryDayCardProps {
    salaryDay: number | null;
    onUpdate: (newDay: number | null) => void;
}

export function SalaryDayCard({ salaryDay, onUpdate }: SalaryDayCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dayInput, setDayInput] = useState<string>(
        salaryDay ? String(salaryDay) : "",
    );
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const getDaysRemaining = (targetDay: number) => {
        const today = new Date();
        const currentDay = today.getDate();
        if (currentDay === targetDay) return 0;
        if (currentDay < targetDay) return targetDay - currentDay;
        const lastDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
        ).getDate();
        return lastDayOfMonth - currentDay + targetDay;
    };

    const handleOpenEdit = () => {
        setDayInput(salaryDay ? String(salaryDay) : "");
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const parsedDay = parseInt(dayInput, 10);
        if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
            setErrorMsg("Kun 1 dan 31 gacha bo'lishi kerak.");
            return;
        }

        setLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setErrorMsg("Avtorizatsiyadan o'tilmagan.");
                setLoading(false);
                return;
            }

            const { error } = await supabase
                .from("profiles")
                .update({
                    salary_day: parsedDay,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) {
                setErrorMsg(error.message || "Saqlashda xatolik yuz berdi.");
            } else {
                onUpdate(parsedDay);
                setIsModalOpen(false);
            }
        } catch {
            setErrorMsg("Serverda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Oylik tushish sanasini o'chirishni xohlaysizmi?")) return;
        setLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { error } = await supabase
                .from("profiles")
                .update({
                    salary_day: null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (!error) {
                onUpdate(null);
            }
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const daysLeft = salaryDay ? getDaysRemaining(salaryDay) : null;

    return (
        <>
            <div className="mb-6 p-5 sm:p-6 rounded-[32px] bg-card/40 border border-border shadow-sm backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-primary shrink-0" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                                Oylik maoshi sanasi
                            </span>
                            {salaryDay && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-emerald-500 border border-emerald-500/20">
                                    {daysLeft === 0
                                        ? "Bugun oylik kuni!"
                                        : `${daysLeft} kun qoldi`}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-foreground">
                            {salaryDay
                                ? `Har oyning ${salaryDay}-sanasida`
                                : "Oylik sanasi belgilanmagan"}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center pl-16 sm:pl-0">
                    {salaryDay ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleOpenEdit}
                                disabled={loading}
                                className="h-10 px-4 rounded-xl font-bold text-xs gap-1.5 border-border/50 bg-background/50 hover:bg-muted"
                            >
                                <Pencil className="w-3.5 h-3.5 shrink-0 text-primary" />
                                Tahrirlash
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={loading}
                                className="h-10 px-3.5 rounded-xl font-bold text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                O'chirish
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            onClick={handleOpenEdit}
                            disabled={loading}
                            className="h-10 px-5 rounded-xl font-bold text-xs gap-2 shadow-sm active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4 shrink-0" />
                            Sana belgilash
                        </Button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
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
                            className="bg-card border border-border w-full max-w-sm rounded-[32px] shadow-2xl p-7 relative overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 h-8 w-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight mb-1">
                                    {salaryDay
                                        ? "Oylik sanasini tahrirlash"
                                        : "Oylik sanasini belgilash"}
                                </h2>
                                <p className="text-xs text-muted-foreground font-medium max-w-[260px]">
                                    Har oy maoshingiz tushadigan aniq kunni (1 dan 31 gacha) kiriting.
                                </p>
                            </div>

                            {errorMsg && (
                                <div className="flex items-center gap-2 p-3 rounded-2xl bg-destructive/10 text-destructive text-xs border border-destructive/20 mb-4">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{errorMsg}</p>
                                </div>
                            )}

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="salary_day_input"
                                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                                    >
                                        Oylik tushish kuni (1 - 31)
                                    </Label>
                                    <Input
                                        id="salary_day_input"
                                        type="number"
                                        min={1}
                                        max={31}
                                        step={1}
                                        required
                                        placeholder="Masalan: 5"
                                        value={dayInput}
                                        onChange={(e) => setDayInput(e.target.value)}
                                        className="h-12 rounded-2xl bg-muted/50 border-border text-base font-semibold text-center"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-1/2 h-11 rounded-2xl font-bold text-xs border-border/50"
                                    >
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-1/2 h-11 rounded-2xl font-bold text-xs"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Saqlash"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
