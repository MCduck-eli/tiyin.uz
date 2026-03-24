"use client";

import { useEffect, useState, useCallback } from "react";
import { HowItWorks } from "@/components/landing/howIt-works";
import { StockTicker } from "@/components/landing/infinite-logos";
import { AnimatePresence } from "framer-motion";
import { PieChart, ShieldCheck, Zap } from "lucide-react";
import AuthModal from "@/components/auth-modal";
import { AICounselor } from "@/components/ai-counselor";
import NewNews from "@/components/new-news";
import ChartCard from "@/components/chart-card";
import InfoText from "@/components/info-text";

interface InfoProps {
    liveStocks: any;
    user?: any;
}

interface NewsItem {
    id: number;
    headline: string;
    category: string;
    datetime: number;
    image: string;
    summary: string;
    url: string;
}

export default function FirsInfo({ liveStocks, user }: InfoProps) {
    const [showHowItWorks, setShowHowItWorks] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);

    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);

    const fetchRealNews = useCallback(async () => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_FINHUB_API_KEY;
            if (!apiKey) return;

            const response = await fetch(
                `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`,
            );
            const data = await response.json();

            if (Array.isArray(data)) {
                const filtered = data
                    .filter((item) => item.image && item.headline)
                    .slice(0, 4);
                setNews(filtered);
            }
        } catch (error) {
            console.error("Yangiliklarni olishda xato:", error);
        } finally {
            setNewsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRealNews();
        const interval = setInterval(fetchRealNews, 600000);
        return () => clearInterval(interval);
    }, [fetchRealNews]);

    return (
        <main className="flex min-h-screen flex-col items-center px-6 relative">
            <AICounselor />
            <AnimatePresence>
                {showHowItWorks && (
                    <HowItWorks
                        key="how-it-works-modal"
                        onClose={() => setShowHowItWorks(false)}
                    />
                )}
                <AuthModal
                    key="auth-modal"
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    type="register"
                />
            </AnimatePresence>
            <InfoText
                user={user}
                setShowAuthModal={setShowAuthModal}
                setShowAccountModal={setShowAccountModal}
                setShowHowItWorks={setShowHowItWorks}
            />

            <StockTicker />
            <ChartCard liveStocks={liveStocks} />
            <NewNews newsLoading={newsLoading} news={news} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mt-24 mb-32">
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
                        className="p-10 rounded-[48px] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                        <div
                            className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 bg-background shadow-sm ${feature.color}`}
                        >
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                            {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Tiyin tizimi sizning moliyangizni aqlli nazorat
                            qilish uchun mo'ljallangan.
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
