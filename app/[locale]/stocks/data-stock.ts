export const fetchFullMarket = async (
    setStocks: React.Dispatch<React.SetStateAction<any[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const API_KEY = process.env.NEXT_PUBLIC_FINHUB_API_KEY;
    const BIG_STOCKS = [
        { symbol: "AAPL", name: "Apple Inc.", sector: "technology" },
        { symbol: "MSFT", name: "Microsoft", sector: "technology" },
        { symbol: "GOOGL", name: "Alphabet", sector: "technology" },
        { symbol: "AMZN", name: "Amazon.com", sector: "consumer" },
        { symbol: "NVDA", name: "Nvidia", sector: "semiconductors" },
        { symbol: "META", name: "Meta Platforms", sector: "technology" },
        { symbol: "TSLA", name: "Tesla Inc.", sector: "automotive" },
        { symbol: "BRK.B", name: "Berkshire", sector: "financials" },
        { symbol: "V", name: "Visa Inc.", sector: "financials" },
        { symbol: "JPM", name: "JPMorgan", sector: "financials" },
        { symbol: "LLY", name: "Eli Lilly", sector: "healthcare" },
        { symbol: "UNH", name: "UnitedHealth", sector: "healthcare" },
    ];

    try {
        const results = await Promise.all(
            BIG_STOCKS.map(async (item) => {
                const res = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${item.symbol}&token=${API_KEY}`,
                );
                const data = await res.json();
                return {
                    ...item,
                    price: data.c ?? 0,
                    change: data.d ?? 0,
                    percent: data.dp ?? 0,
                    high: data.h ?? 0,
                    low: data.l ?? 0,
                    up: (data.dp ?? 0) >= 0,
                };
            }),
        );
        setStocks(results);
        setLoading(false);
    } catch (error) {
        console.error("Market fetch error:", error);
    }
};
