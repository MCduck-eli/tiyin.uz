"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import FirsInfo from "./components/first-info";
import FirstDashboard from "./components/first-dashboard";

export default function Home() {
    const t = useTranslations("HomePage");

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liveStocks, setLiveStocks] = useState([
        {
            id: "1",
            name: "Nvidia",
            price: 726.13,
            color: "text-emerald-500",
            chart: [20, 40, 35, 50, 45, 70, 65],
        },
        {
            id: "2",
            name: "Apple",
            price: 182.63,
            color: "text-emerald-500",
            chart: [50, 45, 60, 55, 70, 65, 80],
        },
        {
            id: "3",
            name: "Tesla",
            price: 193.57,
            color: "text-destructive",
            chart: [80, 70, 75, 60, 50, 55, 45],
        },
        {
            id: "4",
            name: "Bitcoin",
            price: 64231,
            color: "text-emerald-500",
            chart: [30, 40, 30, 60, 50, 80, 95],
        },
    ]);

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            },
        );

        const interval = setInterval(() => {
            setLiveStocks((prev) =>
                prev.map((stock) => {
                    const change = (Math.random() - 0.5) * 2;
                    const newPrice = Math.max(1, stock.price + change);
                    const newChart = [
                        ...stock.chart.slice(1),
                        Math.floor(Math.random() * 70) + 20,
                    ];
                    return {
                        ...stock,
                        price: newPrice,
                        chart: newChart,
                        color:
                            change >= 0
                                ? "text-emerald-500"
                                : "text-destructive",
                    };
                }),
            );
        }, 3000);

        return () => {
            if (authListener?.subscription) {
                authListener.subscription.unsubscribe();
            }
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-background" />;
    }

    if (!user) {
        return <FirsInfo liveStocks={liveStocks} />;
    }

    return <FirstDashboard />;
}
