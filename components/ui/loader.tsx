"use client";

import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { useTranslations } from "next-intl";

export function Loader() {
    const t = useTranslations("Common");

    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background">
            <div className="relative flex items-center justify-center">
                <motion.div
                    className="w-24 h-24 rounded-[32px] border-[3px] border-primary/10 border-t-primary/60"
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute w-14 h-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center shadow-inner"
                    animate={{
                        scale: [1, 0.95, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Fingerprint className="w-7 h-7 text-primary/80" />
                </motion.div>
                <div className="absolute -bottom-12 w-16 h-2 bg-primary/10 blur-2xl rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-10 flex flex-col items-center gap-3"
            >
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground/60 ml-1">
                    {t("loading")}
                </p>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1 h-1 rounded-full bg-primary/40"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.15,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
