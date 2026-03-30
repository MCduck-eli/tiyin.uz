"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export default function InfoText({
    user,
    setShowAuthModal,
    setShowAccountModal,
    setShowHowItWorks,
}: any) {
    const t = useTranslations("InfoText");
    const handleAction = () => {
        if (!user) {
            setShowAuthModal(true);
        } else {
            setShowAccountModal(true);
        }
    };

    return (
        <section className="text-center space-y-6 max-w-4xl mb-20 pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 border border-primary/20"
            >
                <Zap className="w-3 h-3 fill-primary" />
                <span className="uppercase tracking-widest">{t("badge")}</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                {t.rich("title", {
                    span: (chunks) => (
                        <span className="text-primary italic">{chunks}</span>
                    ),
                })}
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Button
                    onClick={handleAction}
                    className="rounded-full h-14 px-10 font-bold text-lg gap-3 shadow-xl shadow-primary/20"
                >
                    {t("openAccount")} <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                    variant="outline"
                    className="rounded-full h-14 px-10 font-bold text-lg gap-3 border-2"
                    onClick={() => setShowHowItWorks(true)}
                >
                    <PlayCircle className="w-5 h-5" /> {t("howItWorks")}
                </Button>
            </div>
        </section>
    );
}
