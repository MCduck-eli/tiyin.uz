"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ExpenseChartProps {
    data: any[];
    currencySymbol: string;
}

export const ExpenseChart = ({ data, currencySymbol }: ExpenseChartProps) => {
    return (
        <div className="md:col-span-2 h-112.5 rounded-[48px] bg-card/30 dark:bg-neutral-900/50 border border-border dark:border-white/10 p-10 shadow-2xl flex flex-col relative overflow-hidden group backdrop-blur-xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 dark:bg-primary/20 blur-[100px] rounded-full" />

            <div className="flex justify-between items-center mb-8 relative z-10">
                <p className="text-muted-foreground dark:text-gray-400 text-xs uppercase font-black tracking-widest opacity-70">
                    Xarajatlar dinamikasi
                </p>
                <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full border border-primary/20 dark:border-primary/40">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    <span className="text-[10px] font-bold text-primary dark:text-primary uppercase">
                        Oylik tahlil
                    </span>
                </div>
            </div>

            <div className="flex-1 w-full h-full min-h-0 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorAmt"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="currentColor"
                                    className="text-primary"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="currentColor"
                                    className="text-primary"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="currentColor"
                            className="text-border dark:text-white/5"
                            opacity={0.1}
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 10,
                                fontWeight: 700,
                                fill: "currentColor",
                            }}
                            className="text-muted-foreground dark:text-gray-500"
                            dy={15}
                        />
                        <YAxis
                            hide
                            domain={["dataMin - 100", "dataMax + 100"]}
                        />
                        <Tooltip
                            cursor={{
                                stroke: "rgb(var(--primary) / 0.3)",
                                strokeWidth: 2,
                            }}
                            contentStyle={{
                                backgroundColor: "rgba(var(--card), 0.8)",
                                backdropFilter: "blur(20px)",
                                borderRadius: "24px",
                                border: "1px solid rgba(var(--border), 0.5)",
                                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                                padding: "12px",
                            }}
                            itemStyle={{
                                color: "hsl(var(--primary))",
                                fontWeight: "900",
                                fontSize: "14px",
                            }}
                            labelStyle={{
                                color: "hsl(var(--muted-foreground))",
                                fontSize: "10px",
                                fontWeight: "bold",
                                marginBottom: "4px",
                            }}
                            formatter={(value: any) => [
                                `${Number(value).toLocaleString()} ${currencySymbol}`,
                                "Sarflandi",
                            ]}
                            labelFormatter={(label) => `${label}-sana`}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmt)"
                            animationDuration={1500}
                            connectNulls
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
