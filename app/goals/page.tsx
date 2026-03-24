"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Target,
    TrendingUp,
    Wallet,
    ArrowLeft,
    AlertCircle,
    Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Loader } from "@/components/ui/loader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { GoalsList } from "@/components/dashboard/goals-list";

export default function GoalsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [currency, setCurrency] = useState("UZS");
    const [goal, setGoal] = useState({ title: "", price: 0, monthlySalary: 0 });
    const [result, setResult] = useState<any>(null);

    const navigate = useRouter();

    const fetchGoals = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("goals")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setGoals(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("currency")
                .eq("id", user.id)
                .single();
            const { data: expData } = await supabase
                .from("expenses")
                .select("*")
                .eq("user_id", user.id);

            if (profile) setCurrency(profile.currency);
            if (expData) setExpenses(expData);
            await fetchGoals();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const analysis = useMemo(() => {
        const now = new Date();
        const currentMonthExp = expenses
            .filter((e) => {
                const d = new Date(e.date);
                return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                );
            })
            .reduce((sum, item) => sum + item.amount, 0);

        const minLivingCost =
            currency === "UZS" ? 2500000 : currency === "USD" ? 200 : 20000;
        return {
            realExp: currentMonthExp,
            projectedExp: Math.max(currentMonthExp, minLivingCost),
        };
    }, [expenses, currency]);

    const calculatePlan = () => {
        if (!goal.price || !goal.monthlySalary) return;

        const income = goal.monthlySalary;
        const totalExp = analysis.projectedExp;
        const currentFreeCash = income - totalExp;

        const recommendedSaving =
            currentFreeCash > income * 0.1
                ? currentFreeCash * 0.8
                : income * 0.15;
        const savingsPercent = Math.round((recommendedSaving / income) * 100);
        const monthsNeeded = Math.ceil(goal.price / recommendedSaving);

        setResult({
            months: monthsNeeded,
            monthlySaving: recommendedSaving,
            savingsPercent,
            isTight: currentFreeCash < income * 0.1,
        });
    };

    const handleSaveGoal = async () => {
        if (!result || !goal.title) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from("goals").insert([
            {
                user_id: user.id,
                title: goal.title,
                target_price: goal.price,
                current_saved: 0,
                is_completed: false,
            },
        ]);

        if (!error) {
            setResult(null);
            fetchGoals();
        }
    };

    if (isLoading) return <Loader />;

    return (
        <main className="max-w-5xl mx-auto pt-10 px-6 pb-20">
            <Button
                variant="ghost"
                onClick={() => navigate.back()}
                className="mb-6 rounded-xl gap-2 hover:bg-accent"
            >
                <ArrowLeft size={18} /> Orqaga
            </Button>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                    <Target size={24} />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight">
                    AI Planner
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                <div className="space-y-4">
                    <Card className="p-6 rounded-[30px] border-border bg-card/50 shadow-xl space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase opacity-60">
                                    Maqsad nomi
                                </Label>
                                <Input
                                    placeholder="Masalan: MacBook Pro"
                                    className="rounded-xl border-primary/10 h-11"
                                    onChange={(e) =>
                                        setGoal({
                                            ...goal,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-1 space-y-2">
                                    <Label className="text-xs font-bold uppercase opacity-60">
                                        Valyuta
                                    </Label>
                                    <Select
                                        value={currency}
                                        onValueChange={setCurrency}
                                    >
                                        <SelectTrigger className="rounded-xl h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UZS">
                                                UZS
                                            </SelectItem>
                                            <SelectItem value="USD">
                                                USD
                                            </SelectItem>
                                            <SelectItem value="RUB">
                                                RUB
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-xs font-bold uppercase opacity-60">
                                        Qiymati
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="rounded-xl border-primary/10 h-11 font-bold"
                                        onChange={(e) =>
                                            setGoal({
                                                ...goal,
                                                price: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase opacity-60">
                                    Oylik daromad ({currency})
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="rounded-xl border-primary/10 h-11 font-bold"
                                    onChange={(e) =>
                                        setGoal({
                                            ...goal,
                                            monthlySalary: Number(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-2xl border border-border space-y-2">
                            <div className="flex justify-between text-xs font-bold opacity-60">
                                <span>Yashash xarajatlari (AI):</span>
                                <TrendingUp size={14} />
                            </div>
                            <div className="text-xl font-black">
                                {analysis.projectedExp.toLocaleString()}{" "}
                                <span className="text-xs">{currency}</span>
                            </div>
                        </div>

                        <Button
                            onClick={calculatePlan}
                            disabled={!goal.price || !goal.monthlySalary}
                            className="w-full h-12 rounded-xl font-black gap-2 shadow-lg"
                        >
                            HISOB-KITOBLAR
                        </Button>
                    </Card>
                </div>

                <div className="h-full">
                    {result ? (
                        <Card className="p-8 rounded-[35px] border-primary/20 bg-primary/5 h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-5">
                            <div className="space-y-6">
                                <div className="text-center space-y-1">
                                    <h2 className="text-7xl font-black tracking-tighter">
                                        {result.months}{" "}
                                        <span className="text-xl text-muted-foreground uppercase">
                                            Oy
                                        </span>
                                    </h2>
                                    <p className="text-sm font-bold opacity-70 italic">
                                        {goal.title} uchun muddat
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-background rounded-2xl border border-border text-center">
                                        <span className="block text-2xl font-black text-primary">
                                            {result.savingsPercent}%
                                        </span>
                                        <span className="text-[10px] font-bold opacity-50 uppercase">
                                            Tejash foizi
                                        </span>
                                    </div>
                                    <div className="p-4 bg-background rounded-2xl border border-border text-center">
                                        <span className="block text-lg font-black">
                                            {result.monthlySaving.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] font-bold opacity-50 uppercase">
                                            Oylik mablag'
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 bg-foreground text-background rounded-2xl space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-black text-primary uppercase">
                                        {result.isTight ? (
                                            <AlertCircle size={14} />
                                        ) : (
                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                                                <span className="text-primary-foreground font-bold text-sm">
                                                    T
                                                </span>
                                            </div>
                                        )}
                                        AI Strategiya
                                    </div>
                                    <p className="text-xs leading-relaxed opacity-90 font-medium">
                                        {result.isTight
                                            ? "Daromadingiz va yashash xarajatlaringiz o'rtasidagi farq juda kichik. Maqsadga erishish uchun qo'shimcha daromad yoki xarajatlarni 15% ga qisqartirish shart."
                                            : `Yashash xarajatlaridan tashqari oyiga ${result.monthlySaving.toLocaleString()} ${currency} tejash orqali siz kutilgan muddatda natijaga erishasiz.`}
                                    </p>
                                </div>
                                <Button
                                    onClick={handleSaveGoal}
                                    className="w-full rounded-xl h-12 font-black gap-2"
                                >
                                    <Plus size={18} /> REJANI SAQLASH
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-full border-2 border-dashed border-border rounded-[35px] flex flex-col items-center justify-center p-10 text-center opacity-40">
                            <Wallet size={40} className="mb-4" />
                            <p className="text-sm font-bold">
                                Ma'lumotlar tahlili kutilmoqda
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-50">
                        Mening faol rejalarim
                    </h2>
                </div>

                <GoalsList
                    goals={goals}
                    currency={currency}
                    onUpdate={fetchGoals}
                />
            </div>
        </main>
    );
}
