import { Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface GoalFormProps {
    t: (key: string, options?: any) => string;
    currency: string;
    setCurrency: (value: string) => void;
    goal: {
        title: string;
        price: number;
        monthlySalary: number;
    };
    setGoal: (goal: any) => void;
    analysis: {
        projectedExp: number;
    };
    onCalculate: () => void;
}

export function GoalForm({
    t,
    currency,
    setCurrency,
    goal,
    setGoal,
    analysis,
    onCalculate,
}: GoalFormProps) {
    return (
        <Card className="p-6 rounded-[30px] border-border bg-card/50 shadow-xl space-y-5">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase opacity-60">
                        {t("goalName")}
                    </Label>
                    <Input
                        placeholder={t("goalPlaceholder")}
                        className="rounded-xl border-primary/10 h-11"
                        value={goal.title}
                        onChange={(e) =>
                            setGoal({ ...goal, title: e.target.value })
                        }
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 space-y-2">
                        <Label className="text-xs font-bold uppercase opacity-60">
                            {t("currency")}
                        </Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="rounded-xl h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UZS">UZS</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="RUB">RUB</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label className="text-xs font-bold uppercase opacity-60">
                            {t("price")}
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
                        {t("monthlySalary")} ({currency})
                    </Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        className="rounded-xl border-primary/10 h-11 font-bold"
                        onChange={(e) =>
                            setGoal({
                                ...goal,
                                monthlySalary: Number(e.target.value),
                            })
                        }
                    />
                </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-2xl border border-border space-y-2">
                <div className="flex justify-between text-xs font-bold opacity-60">
                    <span>{t("livingCosts")}:</span>
                    <TrendingUp size={14} />
                </div>
                <div className="text-xl font-black">
                    {analysis.projectedExp.toLocaleString()}{" "}
                    <span className="text-xs">{currency}</span>
                </div>
            </div>

            <Button
                onClick={onCalculate}
                disabled={!goal.price || !goal.monthlySalary}
                className="w-full h-12 rounded-xl font-black gap-2 shadow-lg"
            >
                {t("calculateBtn")}
            </Button>
        </Card>
    );
}
