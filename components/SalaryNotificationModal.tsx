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
import { Banknote, CheckCircle2, AlertCircle, Loader2, BellRing } from "lucide-react";

interface NotificationItem {
    id: string;
    user_id: string;
    type: string;
    message: string;
    is_read: boolean;
    created_at?: string;
}

export function SalaryNotificationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [notification, setNotification] = useState<NotificationItem | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) return;

                const { data, error } = await supabase
                    .from("notifications")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("type", "salary_reminder")
                    .eq("is_read", false)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (!error && data) {
                    setNotification(data);
                    setIsOpen(true);
                }
            } catch {}
        };

        fetchNotification();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setErrorMsg("Iltimos, to'g'ri oylik miqdorini kiriting.");
            return;
        }

        if (!notification) return;

        setLoading(true);

        try {
            await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", notification.id);

            try {
                await fetch("/api/ai/invest-plan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        actual_income: parsedAmount,
                        amount: parsedAmount,
                        notificationId: notification.id,
                    }),
                });
            } catch {}

            setSuccessMsg("Daromad qabul qilindi! AI tejash rejasini tayyorlamoqda.");

            setTimeout(() => {
                setIsOpen(false);
                setNotification(null);
                setAmount("");
                setSuccessMsg(null);
            }, 1800);
        } catch {
            setErrorMsg("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    if (!notification && !isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-[32px] border-border bg-background/95 backdrop-blur-2xl p-6 sm:p-8">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                        <BellRing className="h-7 w-7" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-center tracking-tight">
                        Oylik maoshi eslatmasi
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-muted-foreground">
                        {notification?.message ||
                            "Bugun rejalashtirilgan oylik maoshi kuni! Haqiqatda qabul qilgan summani kiriting."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {errorMsg && (
                        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="font-medium">{errorMsg}</p>
                        </div>
                    )}

                    {successMsg && (
                        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm border border-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <p className="font-medium">{successMsg}</p>
                        </div>
                    )}

                    {!successMsg && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="received_income"
                                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                                >
                                    <Banknote className="h-4 w-4" />
                                    Qabul qilingan daromad miqdori
                                </Label>
                                <Input
                                    id="received_income"
                                    type="number"
                                    min={0}
                                    step="any"
                                    required
                                    placeholder="Masalan: 6000000"
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
                                        <span>Yuborilmoqda...</span>
                                    </div>
                                ) : (
                                    "Tasdiqlash"
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
