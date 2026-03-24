import { ArrowUpRight, Trash2, TrendingUp } from "lucide-react";

interface CostProps {
    setView: any;
    expenses: any[];
    handleDeleteExpense: any;
}

export default function AllCost({
    setView,
    expenses,
    handleDeleteExpense,
}: CostProps) {
    return (
        <div className="flex-1 rounded-[48px] bg-card/40 border border-border p-8 shadow-sm flex flex-col overflow-hidden backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest opacity-70">
                    So'nggi amallar
                </p>
                <button
                    onClick={() => setView("history")}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider hover:underline"
                >
                    Hammasi <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                {expenses.length === 0 ? (
                    <p className="text-center text-xs font-bold text-muted-foreground pt-10">
                        Xarajatlar yo'q
                    </p>
                ) : (
                    expenses.slice(0, 5).map((expense) => (
                        <div
                            key={expense.id}
                            className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 group hover:bg-muted/40 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-card/50 flex items-center justify-center border border-border/50">
                                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground truncate max-w-[80px]">
                                        {expense.note || "Xarajat"}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">
                                        {expense.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-destructive">
                                    -{expense.amount.toLocaleString()}
                                </p>
                                <button
                                    onClick={() =>
                                        handleDeleteExpense(expense.id)
                                    }
                                    className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
