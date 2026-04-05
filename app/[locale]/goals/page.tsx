"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Target, ArrowLeft, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { GoalsList } from "@/components/dashboard/goals-list";
import { useTranslations } from "next-intl";
import { GoalForm } from "./components/goal-form";
import { GoalResult } from "./components/goal-result";

export default function GoalsPage() {
    const t = useTranslations("GoalsPage");
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
        setResult({
            months: Math.ceil(goal.price / recommendedSaving),
            monthlySaving: recommendedSaving,
            savingsPercent: Math.round((recommendedSaving / income) * 100),
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
                ai_monthly_income: goal.monthlySalary,
                ai_expected_daily_expenses: analysis.projectedExp / 30,
                actual_daily_spending: analysis.realExp / 30,
            },
        ]);
        if (!error) {
            setResult(null);
            setGoal({ title: "", price: 0, monthlySalary: 0 });
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
                <ArrowLeft size={18} /> {t("back")}
            </Button>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                    <Target size={24} />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight">
                    {t("title")}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                <GoalForm
                    t={t}
                    currency={currency}
                    setCurrency={setCurrency}
                    goal={goal}
                    setGoal={setGoal}
                    analysis={analysis}
                    onCalculate={calculatePlan}
                />

                <div className="h-full">
                    {result ? (
                        <GoalResult
                            t={t}
                            result={result}
                            goal={goal}
                            currency={currency}
                            onSave={handleSaveGoal}
                        />
                    ) : (
                        <div className="h-full border-2 border-dashed border-border rounded-[35px] flex flex-col items-center justify-center p-10 text-center opacity-40">
                            <Wallet size={40} className="mb-4" />
                            <p className="text-sm font-bold">
                                {t("waitingAnalysis")}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-50">
                    {t("activePlans")}
                </h2>
                <GoalsList
                    goals={goals}
                    currency={currency}
                    onUpdate={fetchGoals}
                />
            </div>
        </main>
    );
}
