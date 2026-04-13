"use client";

import { Button } from "@/components/ui/button";
import { PencilLine, Plus, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface DashboardBtnProps {
    userName: string;
    setIsSetupOpen: any;
    setIsAddOpen: any;
}

export default function DashboardBtn({
    userName,
    setIsSetupOpen,
    setIsAddOpen,
}: DashboardBtnProps) {
    const navigate = useRouter();
    const t = useTranslations("Dashboard");

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pt-10">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-1">
                    {t("welcome", { name: userName || "Mehmon" })}
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                    {t("subtitle")}
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate.push("/goals")}
                    className="rounded-full h-12 px-5 font-bold gap-2 border-border/50 bg-card/50 hover:bg-accent text-primary transition-all"
                >
                    <Target className="w-4 h-4" />
                    <span className="hidden lg:inline">{t("addTarget")}</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSetupOpen(true)}
                    className="rounded-full h-12 px-5 font-bold gap-2 border-border/50 bg-card/50 hover:bg-accent transition-all"
                >
                    <PencilLine className="w-4 h-4 text-primary" />
                    <span className="hidden lg:inline">{t("editBalance")}</span>
                </Button>

                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    {t("addExpense")}
                </Button>
            </div>
        </div>
    );
}
