"use client";

import { Calendar, TrendingUp, Wallet, Zap } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { AddExpenseModal } from "@/components/dashboard/add-expense-modal";
import { CreateAccountModal } from "@/components/dashboard/create-account-modal";
import { supabase } from "@/lib/supabase";
import { CategoryPreview } from "@/components/dashboard/category-preview";
import DashboardCard from "./dashboard-card";
import { ExpenseChart } from "./dashboard-chart";
import AllCost from "./all-cost";
import { TotalExpenseCounter } from "./total-expense-counter";
import { AICounselor } from "@/components/ai-counselor";
import { GoalsList } from "@/components/dashboard/goals-list";
import MaqsadCard from "./maqsad-card";
import DashboardBtn from "./dashboard-btn";
import { useTranslations } from "next-intl";

interface DashboardProps {
    initialBalance?: number;
    expenses?: any[];
    monthlyLimit?: number;
    currency?: string;
}

export default function FirstDashboard({
    initialBalance: propInitialBalance = 0,
    expenses: propExpenses = [],
    monthlyLimit = 0,
    currency: propCurrency = "UZS",
}: DashboardProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [view, setView] = useState<"dashboard" | "history">("dashboard");
    const [userStats, setUserStats] = useState({
        balance: propInitialBalance,
        currency: propCurrency,
    });
    const [localExpenses, setLocalExpenses] = useState<any[]>(propExpenses);
    const [goals, setGoals] = useState<any[]>([]);
    const [userName, setUserName] = useState("");
    const t = useTranslations("DashboardCard");

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

    const fetchDashboardData = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profile) {
            setUserStats({
                balance: profile.initial_balance,
                currency: profile.currency,
            });
            setUserName(profile.full_name || "");
            if (!profile.has_setup) setIsSetupOpen(true);
        } else {
            setIsSetupOpen(true);
        }

        const { data: expenses } = await supabase
            .from("expenses")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });

        if (expenses) setLocalExpenses(expenses);
        await fetchGoals();
        setIsLoading(false);
    };

    useEffect(() => {
        setIsMounted(true);
        fetchDashboardData();
    }, []);

    const handleAddExpense = async (newExpense: any) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("expenses")
            .insert([{ ...newExpense, user_id: user.id }])
            .select()
            .single();

        if (!error && data) {
            setLocalExpenses((prev) => [data, ...prev]);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        const { error } = await supabase.from("expenses").delete().eq("id", id);

        if (!error) {
            setLocalExpenses((prev) => prev.filter((exp) => exp.id !== id));
        }
    };

    const getCurrencySymbol = (code: string) => {
        switch (code) {
            case "USD":
                return "$";
            case "RUB":
                return "₽";
            default:
                return "so'm";
        }
    };

    const chartData = useMemo(() => {
        const now = new Date();
        const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
        ).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => ({
            date: (i + 1).toString(),
            fullDate: new Date(now.getFullYear(), now.getMonth(), i + 1)
                .toISOString()
                .split("T")[0],
            amount: 0,
        }));
        localExpenses.forEach((exp) => {
            const expDate = new Date(exp.date).toISOString().split("T")[0];
            const dayEntry = days.find((d) => d.fullDate === expDate);
            if (dayEntry) dayEntry.amount += exp.amount;
        });
        return days;
    }, [localExpenses]);

    const monthlyTotal = useMemo(() => {
        const now = new Date();
        return localExpenses
            .filter((e) => {
                const d = new Date(e.date);
                return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                );
            })
            .reduce((sum, item) => sum + item.amount, 0);
    }, [localExpenses]);

    const currentBalance = userStats.balance - monthlyTotal;
    const budgetLeft =
        monthlyLimit > 0 ? Math.max(0, monthlyLimit - monthlyTotal) : 0;
    const budgetPercent =
        monthlyLimit > 0 ? Math.round((budgetLeft / monthlyLimit) * 100) : 0;
    const savingsRate =
        userStats.balance > 0
            ? Math.max(
                  0,
                  Math.round(
                      ((userStats.balance - monthlyTotal) / userStats.balance) *
                          100,
                  ),
              )
            : 0;

    const stats = [
        {
            id: "1",
            title: t("balance"),
            value: currentBalance.toLocaleString(),
            trend: currentBalance > 0 ? t("active") : "0",
            icon: <Wallet className="text-blue-500" />,
        },
        {
            id: "2",
            title: t("monthlyExpense"),
            value: monthlyTotal.toLocaleString(),
            trend: `-${((monthlyTotal / (userStats.balance || 1)) * 100).toFixed(1)}%`,
            icon: <TrendingUp className="text-emerald-500" />,
        },
        {
            id: "3",
            title: t("budgetLeft"),
            value: budgetLeft.toLocaleString(),
            trend: `${budgetPercent}%`,
            icon: <Calendar className="text-orange-500" />,
        },
        {
            id: "4",
            title: t("savings"),
            value: `${savingsRate}%`,
            trend: savingsRate > 20 ? t("good") : t("low"),
            icon: <Zap className="text-yellow-500" />,
        },
    ];

    if (!isMounted) return null;

    return (
        <main className="flex min-h-screen flex-col px-6 max-w-7xl mx-auto w-full text-foreground bg-background">
            <AICounselor />
            <CreateAccountModal
                isOpen={isSetupOpen}
                onClose={() => setIsSetupOpen(false)}
                onSave={fetchDashboardData}
            />
            <AddExpenseModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onAdd={handleAddExpense}
            />

            <DashboardBtn
                userName={userName}
                setIsSetupOpen={setIsSetupOpen}
                setIsAddOpen={setIsAddOpen}
            />

            <div className="mb-6">
                <TotalExpenseCounter
                    expenses={localExpenses}
                    currencySymbol={getCurrencySymbol(userStats.currency)}
                />
            </div>

            <div className="mb-8">
                <DashboardCard
                    stats={stats}
                    userStats={userStats}
                    getCurrencySymbol={getCurrencySymbol}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
                <ExpenseChart
                    data={chartData}
                    currencySymbol={getCurrencySymbol(userStats.currency)}
                />
                <div className="flex flex-col gap-6">
                    <CategoryPreview
                        totalBalance={userStats.balance}
                        expenses={localExpenses}
                        currencySymbol={getCurrencySymbol(userStats.currency)}
                    />
                    <AllCost
                        setView={setView}
                        expenses={localExpenses}
                        handleDeleteExpense={handleDeleteExpense}
                    />
                </div>
            </div>

            <MaqsadCard
                userStats={userStats}
                monthlyTotal={monthlyTotal}
                getCurrencySymbol={getCurrencySymbol}
            />

            <div className="mt-10 pb-20">
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-50">
                        Mening faol rejalarim
                    </h2>
                </div>
                <GoalsList
                    goals={goals}
                    currency={getCurrencySymbol(userStats.currency)}
                    onUpdate={fetchGoals}
                />
            </div>
        </main>
    );
}
