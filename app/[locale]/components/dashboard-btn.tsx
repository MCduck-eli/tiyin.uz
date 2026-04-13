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
        <div className="flex items-end justify-between mb-10 pt-10">
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate.push("/goals")}
                    className="rounded-full h-12 px-5 font-bold gap-2 hidden sm:flex border-border/50 bg-card/50 hover:bg-accent text-primary"
                >
                    <Target className="w-4 h-4" /> {t("addTarget")}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSetupOpen(true)}
                    className="rounded-full h-12 px-5 font-bold gap-2 hidden sm:flex border-border/50 bg-card/50 hover:bg-accent"
                >
                    <PencilLine className="w-4 h-4 text-primary" />{" "}
                    {t("editBalance")}
                </Button>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> {t("addExpense")}
                </Button>
            </div>
        </div>
    );
}
