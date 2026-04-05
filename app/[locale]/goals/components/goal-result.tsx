import { AlertCircle, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GoalResultProps {
    t: (key: string, options?: any) => string;
    result: {
        months: number;
        savingsPercent: number;
        monthlySaving: number;
        isTight: boolean;
    };
    goal: {
        title: string;
    };
    currency: string;
    onSave: () => Promise<void> | void;
}

export function GoalResult({
    t,
    result,
    goal,
    currency,
    onSave,
}: GoalResultProps) {
    return (
        <Card className="p-8 rounded-[35px] border-primary/20 bg-primary/5 h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-5">
            <div className="space-y-6">
                <div className="text-center space-y-1">
                    <h2 className="text-7xl font-black tracking-tighter">
                        {result.months}{" "}
                        <span className="text-xl text-muted-foreground uppercase">
                            {t("month")}
                        </span>
                    </h2>
                    <p className="text-sm font-bold opacity-70 italic">
                        {t("termFor")} {goal.title}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-background rounded-2xl border border-border text-center">
                        <span className="block text-2xl font-black text-primary">
                            {result.savingsPercent}%
                        </span>
                        <span className="text-[10px] font-bold opacity-50 uppercase">
                            {t("savingsPercent")}
                        </span>
                    </div>
                    <div className="p-4 bg-background rounded-2xl border border-border text-center">
                        <span className="block text-lg font-black">
                            {result.monthlySaving.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold opacity-50 uppercase">
                            {t("monthlyAmount")}
                        </span>
                    </div>
                </div>

                <div className="p-5 bg-foreground text-background rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-primary uppercase">
                        {result.isTight ? (
                            <AlertCircle size={14} />
                        ) : (
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">
                                    T
                                </span>
                            </div>
                        )}
                        {t("aiStrategy")}
                    </div>
                    <p className="text-xs leading-relaxed opacity-90 font-medium">
                        {result.isTight
                            ? t("strategyTight")
                            : t("strategyNormal", {
                                  amount: result.monthlySaving.toLocaleString(),
                                  currency,
                              })}
                    </p>
                </div>
                <Button
                    onClick={onSave}
                    className="w-full rounded-xl h-12 font-black gap-2"
                >
                    <Plus size={18} /> {t("savePlan")}
                </Button>
            </div>
        </Card>
    );
}
