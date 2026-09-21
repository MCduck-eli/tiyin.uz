"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, CheckCircle2, AlertCircle, Loader2, Sparkles, PiggyBank } from "lucide-react";

interface SalaryNotificationModalProps {
    salaryDay?: number | null;
    currentBalance?: number;
    currencySymbol?: string;
    onSuccess?: () => void;
}

export function SalaryNotificationModal({
    salaryDay,
    currentBalance = 0,
    currencySymbol = "so'm",
    onSuccess,
}: SalaryNotificationModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationId, setNotificationId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const checkSalaryStatus = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data: notif } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .eq("type", "salary_reminder")
                .eq("is_read", false)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (notif) {
                setNotificationId(notif.id);
                setIsOpen(true);
                return;
            }

            if (salaryDay && salaryDay > 0) {
                const now = new Date();
                const currentMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
                const storageKey = `salary_claimed_${user.id}_${currentMonthKey}`;
                const alreadyClaimed = localStorage.getItem(storageKey);

                if (now.getDate() >= salaryDay && !alreadyClaimed) {
                    setIsOpen(true);
                }
            }
        } catch {}
    };

    useEffect(() => {
        checkSalaryStatus();
    }, [salaryDay]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setErrorMsg("Iltimos, to'g'ri oylik miqdorini kiriting.");
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

            const now = new Date();
            const currentMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
            const remainingToSave = currentBalance > 0 ? currentBalance : 0;
            const isoNow = now.toISOString();

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            const currentSavings = Number(profile?.saved_balance || 0);
            const newSavingsTotal = currentSavings + remainingToSave;

            try {
                await supabase
                    .from("profiles")
                    .update({
                        initial_balance: parsedAmount,
                        saved_balance: newSavingsTotal,
                        salary_start_date: isoNow,
                        updated_at: isoNow,
                    })
                    .eq("id", user.id);
            } catch {
                try {
                    await supabase
                        .from("profiles")
                        .update({
                            initial_balance: parsedAmount,
                            saved_balance: newSavingsTotal,
                            updated_at: isoNow,
                        })
                        .eq("id", user.id);
                } catch {
                    await supabase
                        .from("profiles")
                        .update({
                            initial_balance: parsedAmount,
                            updated_at: isoNow,
                        })
                        .eq("id", user.id);
                }
            }

            localStorage.setItem(`salary_start_date_${user.id}`, isoNow);

            if (remainingToSave > 0) {
                try {
                    await supabase.from("goals").insert([
                        {
                            user_id: user.id,
                            title: `O'tgan oydan tejalgan qoldiq (${now.toLocaleDateString("uz-UZ", { month: "long" })})`,
                            target_price: remainingToSave,
                            current_saved: remainingToSave,
                            is_completed: true,
                            ai_monthly_income: parsedAmount,
                            ai_expected_daily_expenses: 0,
                            actual_daily_spending: 0,
                        },
                    ]);
                } catch {}
            }

            if (notificationId) {
                try {
                    await supabase
                        .from("notifications")
                        .update({ is_read: true })
                        .eq("id", notificationId);
                } catch {}
            }

            const storageKey = `salary_claimed_${user.id}_${currentMonthKey}`;
            localStorage.setItem(storageKey, "true");

            try {
                await fetch("/api/ai/invest-plan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        actual_income: parsedAmount,
                        amount: parsedAmount,
                        notificationId,
                    }),
                });
            } catch {}

            setSuccessMsg("Yangi oylik qabul qilindi! Qoldiq mablag' jamg'armaga o'tkazildi.");

            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                setIsOpen(false);
                setAmount("");
                setSuccessMsg(null);
            }, 1800);
        } catch {
            setErrorMsg("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[440px] rounded-[32px] border-border bg-background/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
                <DialogHeader className="space-y-3 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Sparkles className="h-7 w-7" />
                    </div>
                    <DialogTitle className="text-2xl font-black tracking-tight">
                        Oylik maoshi tushdi!
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground max-w-[340px] mx-auto">
                        Belgilangan sana bo'yicha oylik kuni keldi. O'tgan oydan qolgan barcha mablag'ingiz tejalgan jamg'armangizga o'tkaziladi.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    {currentBalance > 0 && (
                        <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shrink-0">
                                    <PiggyBank className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                        Tejaladigan qoldiq pul
                                    </p>
                                    <p className="text-sm font-bold text-foreground">
                                        Jamg'armaga o'tadi
                                    </p>
                                </div>
                            </div>
                            <span className="text-base font-black text-emerald-500 tabular-nums">
                                +{currentBalance.toLocaleString()} {currencySymbol}
                            </span>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="font-medium">{errorMsg}</p>
                        </div>
                    )}

                    {successMsg && (
                        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <p className="font-medium">{successMsg}</p>
                        </div>
                    )}

                    {!successMsg && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="new_received_income"
                                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                                >
                                    <Banknote className="h-4 w-4" />
                                    Yangi tushgan oylik summasi
                                </Label>
                                <Input
                                    id="new_received_income"
                                    type="number"
                                    min={0}
                                    step="any"
                                    required
                                    placeholder="Masalan: 5000000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-12 rounded-2xl bg-muted/50 border-border text-base font-semibold"
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-95 shadow-md active:scale-[0.98] transition-all"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Qabul qilinmoqda...</span>
                                    </div>
                                ) : (
                                    "Oylikni qabul qilish va hisobni yangilash"
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
