"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Trophy, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Goal {
    id: string;
    title: string;
    target_price: number;
    is_completed: boolean;
    created_at: string;
    ai_monthly_income: number;
    ai_expected_daily_expenses: number;
    actual_daily_spending: number;
}

interface GoalsListProps {
    goals: Goal[];
    currency: string;
    onUpdate: () => void;
}

export function GoalsList({ goals, currency, onUpdate }: GoalsListProps) {
    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("goals").delete().eq("id", id);
        if (!error) onUpdate();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
                const income = goal.ai_monthly_income || 0;
                const expectedExp = goal.ai_expected_daily_expenses || 0;
                const actualExp = goal.actual_daily_spending || 0;
                const target = goal.target_price || 1;

                const dailyIncome = income / 30;
                const expectedDailySaving = dailyIncome - expectedExp;
                const actualDailySaving = dailyIncome - actualExp;

                const daysPassed = Math.max(
                    1,
                    Math.floor(
                        (new Date().getTime() -
                            new Date(goal.created_at || new Date()).getTime()) /
                            (1000 * 60 * 60 * 24),
                    ),
                );

                const totalCalculatedSaved = actualDailySaving * daysPassed;

                const progress =
                    Math.min(
                        100,
                        Math.max(0, (totalCalculatedSaved / target) * 100),
                    ) || 0;

                const isLosingGround = actualDailySaving < expectedDailySaving;

                return (
                    <Card
                        key={goal.id}
                        className="p-6 rounded-[32px] border-2 bg-card relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-xl font-black uppercase italic flex items-center gap-2">
                                    {goal.title || "Reja"}{" "}
                                    {goal.is_completed && (
                                        <Trophy
                                            className="text-yellow-500"
                                            size={18}
                                        />
                                    )}
                                </h4>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    AI Bashorati:{" "}
                                    {actualDailySaving > 0
                                        ? Math.ceil(
                                              (target - totalCalculatedSaved) /
                                                  actualDailySaving,
                                          )
                                        : "∞"}{" "}
                                    kun
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(goal.id)}
                                className="rounded-full text-destructive"
                            >
                                <Trash2 size={20} />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end text-[10px] font-black uppercase">
                                    <span className="flex items-center gap-1 opacity-60">
                                        AI Progress
                                    </span>
                                    <span
                                        className={
                                            isLosingGround
                                                ? "text-destructive"
                                                : "text-primary"
                                        }
                                    >
                                        {progress.toFixed(1)}%
                                    </span>
                                </div>
                                <Progress
                                    value={progress}
                                    className={`h-3 ${isLosingGround ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}
                                />
                            </div>
                            <div
                                className={`p-4 rounded-2xl flex items-center justify-between ${isLosingGround ? "bg-destructive/10 border border-destructive/20" : "bg-primary/10 border border-primary/20"}`}
                            >
                                <div className="flex items-center gap-3">
                                    {isLosingGround ? (
                                        <AlertCircle
                                            className="text-destructive"
                                            size={20}
                                        />
                                    ) : (
                                        <TrendingUp
                                            className="text-primary"
                                            size={20}
                                        />
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black uppercase opacity-60">
                                            Bugungi holat
                                        </p>
                                        <p className="text-sm font-bold italic">
                                            {isLosingGround
                                                ? "Xarajat ko'p - Rejadan uzoqlashish"
                                                : "Tejamkorlik - Maqsadga yaqinlashish"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black opacity-40 uppercase">
                                        Kunlik Balans
                                    </p>
                                    <p
                                        className={`text-sm font-black ${actualDailySaving >= 0 ? "text-emerald-500" : "text-destructive"}`}
                                    >
                                        {actualDailySaving.toFixed(0)}{" "}
                                        {currency}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-50 tracking-tighter">
                                <span>
                                    Maqsad: {target.toLocaleString()} {currency}
                                </span>
                                <span>
                                    Virtual Jamg'arma:{" "}
                                    {totalCalculatedSaved.toLocaleString(
                                        undefined,
                                        { maximumFractionDigits: 0 },
                                    )}{" "}
                                    {currency}
                                </span>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
