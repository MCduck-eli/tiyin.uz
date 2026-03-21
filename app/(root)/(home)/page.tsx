"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BarChart3,
    ShieldCheck,
    Zap,
    PlayCircle,
    HelpCircle,
    LineChart,
    PieChart,
    Plus,
    TrendingUp,
    Wallet,
    Calendar,
    ArrowUpRight,
} from "lucide-react";
import { StockTicker } from "@/components/landing/infinite-logos";
import { motion, AnimatePresence } from "framer-motion";
import { HowItWorks } from "@/components/landing/howIt-works";

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showHowItWorks, setShowHowItWorks] = useState(false);
    const [liveStocks, setLiveStocks] = useState([
        {
            name: "Nvidia",
            price: 726.13,
            color: "text-emerald-500",
            chart: [20, 40, 35, 50, 45, 70, 65],
        },
        {
            name: "Apple",
            price: 182.63,
            color: "text-emerald-500",
            chart: [50, 45, 60, 55, 70, 65, 80],
        },
        {
            name: "Tesla",
            price: 193.57,
            color: "text-destructive",
            chart: [80, 70, 75, 60, 50, 55, 45],
        },
        {
            name: "Bitcoin",
            price: 64231,
            color: "text-emerald-500",
            chart: [30, 40, 30, 60, 50, 80, 95],
        },
    ]);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
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
            authListener.subscription.unsubscribe();
            clearInterval(interval);
        };
    }, []);

    if (loading) return null;

    if (!user) {
        return (
            <main className="flex min-h-screen flex-col items-center px-6 relative">
                <AnimatePresence>
                    {showHowItWorks && (
                        <HowItWorks onClose={() => setShowHowItWorks(false)} />
                    )}
                </AnimatePresence>

                <section className="text-center space-y-6 max-w-4xl mb-20 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 border border-primary/20"
                    >
                        <Zap className="w-3 h-3 fill-primary" />
                        <span className="uppercase tracking-widest">
                            Premium moliya ekotizimi
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                        Pulingizni <br />
                        <span className="text-primary italic">
                            sanashni
                        </span>{" "}
                        o'rganing.
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        Tiyin — murakkab jadvallardan charchaganlar uchun.
                        Minimalistik dizayn, maksimal natija va aqlli tahlil.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <Button className="rounded-full h-14 px-10 font-bold text-lg gap-3 shadow-xl shadow-primary/20">
                            Hisob ochish <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full h-14 px-10 font-bold text-lg gap-3 border-2"
                            onClick={() => setShowHowItWorks(true)}
                        >
                            <PlayCircle className="w-5 h-5" /> Qanday ishlaydi?
                        </Button>
                    </div>
                </section>

                <StockTicker />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl px-6 mt-12">
                    {liveStocks.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-[32px] bg-card/50 backdrop-blur-md border border-border"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                        {item.name}
                                    </p>
                                    <AnimatePresence mode="wait">
                                        <motion.h4
                                            key={item.price}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-2xl font-black tabular-nums"
                                        >
                                            $
                                            {item.price.toLocaleString(
                                                undefined,
                                                { minimumFractionDigits: 2 },
                                            )}
                                        </motion.h4>
                                    </AnimatePresence>
                                </div>
                                <div
                                    className={`px-2 py-0.5 rounded-full bg-muted text-[10px] font-black ${item.color}`}
                                >
                                    LIVE
                                </div>
                            </div>
                            <div className="flex items-end gap-1.5 h-16">
                                {item.chart.map((h, j) => (
                                    <motion.div
                                        key={j}
                                        animate={{ height: `${h}%` }}
                                        className={`flex-1 rounded-full ${item.color === "text-emerald-500" ? "bg-emerald-500" : "bg-destructive"} opacity-40`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mt-25 mb-32">
                    {[
                        {
                            icon: <PieChart />,
                            title: "Vizual Analitika",
                            color: "text-blue-500",
                        },
                        {
                            icon: <ShieldCheck />,
                            title: "Maksimal Xavfsizlik",
                            color: "text-emerald-500",
                        },
                        {
                            icon: <Zap />,
                            title: "Ultra Tezkor",
                            color: "text-orange-500",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="p-10 rounded-[48px] bg-muted/30 border border-border/50"
                        >
                            <div
                                className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 bg-background shadow-sm ${feature.color}`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground">
                                Tiyin tizimi sizning moliyangizni aqlli nazorat
                                qilish uchun mo'ljallangan.
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col  px-6 max-w-7xl mx-auto w-full text-white">
            <div className="flex items-end justify-between mb-10 text-white">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tight ">
                        Xush kelibsiz!
                    </h2>
                    <p className="text-muted-foreground font-medium">
                        Bugungi moliyaviy holatingiz bilan tanishing.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-12 h-12 border-border/50 bg-card"
                    >
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                    </Button>
                    <Button className="rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> Xarajat qo'shish
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    {
                        title: "Umumiy balans",
                        value: "2,450,000",
                        trend: "+12%",
                        icon: <Wallet className="text-blue-500" />,
                    },
                    {
                        title: "Oylik xarajat",
                        value: "840,000",
                        trend: "-5%",
                        icon: <TrendingUp className="text-emerald-500" />,
                    },
                    {
                        title: "Reja qoldiqlari",
                        value: "1,100,000",
                        trend: "75%",
                        icon: <Calendar className="text-orange-500" />,
                    },
                    {
                        title: "Tejamkorlik",
                        value: "15%",
                        trend: "+2%",
                        icon: <Zap className="text-yellow-500" />,
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-[32px] bg-card border border-border shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-1 rounded-full bg-muted ${stat.trend.startsWith("+") ? "text-emerald-500" : "text-destructive"}`}
                            >
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
                            {stat.title}
                        </p>
                        <h3 className="text-2xl font-black tabular-nums">
                            {stat.value}{" "}
                            <span className="text-sm font-medium text-muted-foreground">
                                so'm
                            </span>
                        </h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="md:col-span-2 h-[450px] rounded-[48px] bg-card border border-border p-10 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <p className="text-muted-foreground text-xs uppercase font-black tracking-widest">
                            Xarajatlar dinamikasi
                        </p>
                        <div className="flex gap-2">
                            {["Hafta", "Oy", "Yil"].map((t) => (
                                <button
                                    key={t}
                                    className="text-[10px] font-bold px-3 py-1 rounded-full bg-muted hover:bg-primary/20 transition-colors uppercase tracking-wider"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <LineChart className="w-64 h-64 text-primary" />
                    </div>
                </div>
                <div className="h-[450px] rounded-[48px] bg-card border border-border p-10 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-muted-foreground text-xs uppercase font-black tracking-widest">
                            So'nggi amallar
                        </p>
                        <button className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                            Hammasi <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 opacity-20" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">
                                Hali ma'lumotlar yo'q
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Birinchi xarajatingizni qo'shing
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs font-bold mt-2"
                        >
                            Hozir qo'shish
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
