"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Search,
    Coins,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Trash2,
    FilterX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HistoryTableProps {
    expenses: any[];
    currencySymbol: string;
    onDelete: (id: string) => void;
    onBack: () => void;
}

export function HistoryTable({
    expenses,
    currencySymbol,
    onDelete,
    onBack,
}: HistoryTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredExpenses = useMemo(() => {
        const filtered = expenses.filter((exp) => {
            const expDate = new Date(exp.date).getTime();
            const start = startDate ? new Date(startDate).getTime() : -Infinity;
            const end = endDate ? new Date(endDate).getTime() : Infinity;
            const matchesSearch =
                (exp.note || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                exp.category.toLowerCase().includes(searchTerm.toLowerCase());

            return expDate >= start && expDate <= end && matchesSearch;
        });
        setCurrentPage(1);
        return filtered;
    }, [expenses, startDate, endDate, searchTerm]);

    const totalHistoryAmount = useMemo(() => {
        return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    }, [filteredExpenses]);

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedExpenses = filteredExpenses.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 w-full pb-10 max-w-5xl mx-auto"
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="group rounded-xl hover:bg-primary/5 transition-all gap-2 h-9"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-xs">Orqaga</span>
                    </Button>

                    <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-3 py-1 rounded-lg border border-border/40">
                        <CalendarIcon className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase">
                            Tarix
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 rounded-xl bg-card text-xs border-border/40"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-card border border-border/40 p-1.5 rounded-xl shadow-sm md:col-span-2">
                        <div className="flex-1 flex items-center gap-2 px-2">
                            <span className="text-[9px] font-black uppercase text-muted-foreground">
                                Dan
                            </span>
                            <input
                                type="date"
                                className="bg-transparent text-xs font-bold focus:outline-none w-full"
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="w-[1px] h-4 bg-border/40" />
                        <div className="flex-1 flex items-center gap-2 px-2">
                            <span className="text-[9px] font-black uppercase text-muted-foreground">
                                Gacha
                            </span>
                            <input
                                type="date"
                                className="bg-transparent text-xs font-bold focus:outline-none w-full"
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                layout
                className="relative overflow-hidden p-5 rounded-[24px] bg-card border border-border shadow-md"
            >
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Coins className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                                Jami sarf
                            </p>
                            <h3 className="text-xl font-black tabular-nums tracking-tighter">
                                {totalHistoryAmount.toLocaleString()}{" "}
                                <span className="text-xs text-primary">
                                    {currencySymbol}
                                </span>
                            </h3>
                        </div>
                    </div>
                    <div className="bg-muted/40 px-3 py-1.5 rounded-xl border border-border/40 text-right">
                        <p className="text-[8px] font-black uppercase text-muted-foreground">
                            Soni
                        </p>
                        <p className="text-sm font-black">
                            {filteredExpenses.length}
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/10 border-b border-border/40">
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    Sana
                                </th>
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    Kategoriya
                                </th>
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    Izoh
                                </th>
                                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">
                                    Summa
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            <AnimatePresence mode="popLayout">
                                {paginatedExpenses.length === 0 ? (
                                    <tr className="h-32 text-center">
                                        <td colSpan={4} className="p-10">
                                            <FilterX className="w-8 h-8 mx-auto opacity-10 mb-2" />
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                                Topilmadi
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedExpenses.map((exp, idx) => (
                                        <motion.tr
                                            key={exp.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="group hover:bg-primary/[0.01] transition-colors"
                                        >
                                            <td className="p-4">
                                                <p className="text-xs font-bold">
                                                    {new Date(
                                                        exp.date,
                                                    ).toLocaleDateString(
                                                        "uz-UZ",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                        },
                                                    )}
                                                </p>
                                                <p className="text-[9px] text-muted-foreground font-medium">
                                                    {new Date(
                                                        exp.date,
                                                    ).getFullYear()}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border/40 text-[9px] font-black uppercase">
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[150px]">
                                                    {exp.note || "—"}
                                                </p>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className="text-sm font-black text-destructive tabular-nums">
                                                        -
                                                        {exp.amount.toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            onDelete(exp.id)
                                                        }
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="p-3 border-t border-border/30 flex items-center justify-between bg-muted/5">
                        <span className="text-[10px] font-bold text-muted-foreground px-2">
                            {currentPage} / {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="h-7 w-7 rounded-lg"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>
                            <div className="flex gap-1">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    if (
                                        totalPages > 4 &&
                                        Math.abs(currentPage - pageNum) > 1 &&
                                        pageNum !== 1 &&
                                        pageNum !== totalPages
                                    )
                                        return null;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() =>
                                                setCurrentPage(pageNum)
                                            }
                                            className={`h-7 w-7 rounded-lg text-[10px] font-black transition-all ${
                                                currentPage === pageNum
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-background border border-border/40"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="h-7 w-7 rounded-lg"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
