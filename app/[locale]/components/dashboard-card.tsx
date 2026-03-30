import { StatItem } from "@/types";
import { motion } from "framer-motion";

interface StatsProps {
    stats: any;
    userStats: any;
    getCurrencySymbol: any;
}

export default function DashboardCard({
    stats,
    userStats,
    getCurrencySymbol,
}: StatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat: StatItem) => (
                <motion.div
                    key={stat.id}
                    className="p-6 rounded-[32px] bg-card/40 border border-border shadow-sm backdrop-blur-md"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center">
                            {stat.icon}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-muted text-emerald-500">
                            {stat.trend}
                        </span>
                    </div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">
                        {stat.title}
                    </p>
                    <h3 className="text-2xl font-black tabular-nums text-foreground">
                        {stat.value}
                        <span className="text-sm font-medium text-muted-foreground ml-1">
                            {stat.title.includes("Tejamkorlik")
                                ? ""
                                : getCurrencySymbol(userStats.currency)}
                        </span>
                    </h3>
                </motion.div>
            ))}
        </div>
    );
}
