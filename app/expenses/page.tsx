"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader } from "@/components/ui/loader";
import { HistoryTable } from "../(root)/components/history-table";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("expenses")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("date", { ascending: false });
                setExpenses(data || []);
            }
            setLoading(false);
        };
        fetchExpenses();
    }, []);

    if (loading) return <Loader />;

    return (
        <main className="max-w-7xl mx-auto pt-10 px-6">
            <HistoryTable
                expenses={expenses}
                currencySymbol="so'm"
                onDelete={() => {}}
                onBack={() => window.history.back()}
            />
        </main>
    );
}
