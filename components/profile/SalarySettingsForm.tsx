"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Calendar,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

interface SalarySettingsFormProps {
    initialSalaryDay?: number | null;
    onSaved?: (salaryDay: number) => void;
}

export function SalarySettingsForm({
    initialSalaryDay,
    onSaved,
}: SalarySettingsFormProps) {
    const [salaryDay, setSalaryDay] = useState<string>(
        initialSalaryDay !== undefined && initialSalaryDay !== null
            ? String(initialSalaryDay)
            : "",
    );
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error" | null;
        message: string | null;
    }>({ type: null, message: null });

    useEffect(() => {
        if (initialSalaryDay !== undefined && initialSalaryDay !== null) {
            setSalaryDay(String(initialSalaryDay));
        }
    }, [initialSalaryDay]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: null, message: null });

        const dayNum = parseInt(salaryDay, 10);

        if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
            setStatus({
                type: "error",
                message: "Oylik tushish kuni 1 dan 31 gacha bo'lishi kerak.",
            });
            return;
        }

        setLoading(true);

        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                setStatus({
                    type: "error",
                    message:
                        "Foydalanuvchi aniqlanmadi. Qaytadan tizimga kiring.",
                });
                setLoading(false);
                return;
            }

            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    salary_day: dayNum,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (updateError) {
                setStatus({
                    type: "error",
                    message:
                        updateError.message ||
                        "Ma'lumotlarni saqlashda xatolik yuz berdi.",
                });
            } else {
                setStatus({
                    type: "success",
                    message: "Oylik tushish sanasi muvaffaqiyatli saqlandi!",
                });
                if (onSaved) {
                    onSaved(dayNum);
                }
            }
        } catch {
            setStatus({
                type: "error",
                message: "Server bilan bog'lanishda xatolik yuz berdi.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-[32px] border-border bg-card p-2 sm:p-4 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black tracking-tight">
                            Oylik maoshi sanasi
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Oyligingiz tushadigan sanani belgilang. Shu kuni tizim bildirishnoma orqali tushgan summani so'raydi
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {status.message && (
                        <div
                            className={`flex items-center gap-2 rounded-2xl p-4 text-sm border ${
                                status.type === "success"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : "bg-destructive/10 text-destructive border-destructive/20"
                            }`}
                        >
                            {status.type === "success" ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                            ) : (
                                <AlertCircle className="h-4 w-4 shrink-0" />
                            )}
                            <p className="font-medium">{status.message}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label
                            htmlFor="salary_day"
                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            Oylik tushish kuni (1 - 31)
                        </Label>
                        <Input
                            id="salary_day"
                            type="number"
                            min={1}
                            max={31}
                            step={1}
                            required
                            placeholder="Masalan: 5"
                            value={salaryDay}
                            onChange={(e) => setSalaryDay(e.target.value)}
                            className="h-12 rounded-2xl bg-muted/50 border-border text-base font-semibold"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-95 transition-all shadow-md active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saqlanmoqda...</span>
                            </div>
                        ) : (
                            "Saqlash"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
