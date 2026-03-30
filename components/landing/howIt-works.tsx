"use client";

import { motion } from "framer-motion";
import {
    X,
    Edit3,
    PieChart,
    AlertTriangle,
    PlusCircle,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface HowItWorksProps {
    onClose: () => void;
}

export function HowItWorks({ onClose }: HowItWorksProps) {
    const t = useTranslations("HowItWorks");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 md:p-12 relative scrollbar-hide"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-6 top-6 rounded-full bg-muted/50 hover:bg-muted z-10"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>

                <div className="space-y-10">
                    <div className="text-center space-y-3 pt-4">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight italic text-primary">
                            {t("title")}
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Edit3 className="text-blue-500" />,
                                title: t("step1Title"),
                                desc: t("step1Desc"),
                            },
                            {
                                icon: <PieChart className="text-purple-500" />,
                                title: t("step2Title"),
                                desc: t("step2Desc"),
                            },
                            {
                                icon: (
                                    <AlertTriangle className="text-orange-500" />
                                ),
                                title: t("step3Title"),
                                desc: t("step3Desc"),
                            },
                        ].map((step, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-[32px] bg-muted/30 border border-border/50"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm mb-4">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-muted/20 rounded-[32px] p-8 border border-border/50">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <PlusCircle className="text-primary w-6 h-6" />{" "}
                            {t("categoriesTitle")}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                "food",
                                "clothing",
                                "entertainment",
                                "debts",
                                "shopping",
                                "transport",
                            ].map((cat) => (
                                <span
                                    key={cat}
                                    className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium shadow-sm"
                                >
                                    {t(`categories.${cat}`)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center pb-4">
                        <Button
                            className="rounded-full h-14 px-12 text-lg font-bold gap-2 shadow-lg"
                            onClick={onClose}
                        >
                            <CheckCircle2 className="w-5 h-5" /> {t("cta")}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
