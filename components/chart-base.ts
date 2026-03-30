export const fetchStockData = async (
    setStocks: (data: any[]) => void,
    setIsLoading: (loading: boolean) => void,
) => {
    const API_KEY = process.env.NEXT_PUBLIC_FINHUB_API_KEY;
    const SYMBOLS = ["AAPL", "TSLA", "MSFT", "NVDA"];

    try {
        const results = await Promise.all(
            SYMBOLS.map(async (symbol) => {
                const quoteRes = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
                );
                const quoteData = await quoteRes.json();
                const to = Math.floor(Date.now() / 1000);
                const from = to - 86400;
                const candleRes = await fetch(
                    `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=60&from=${from}&to=${to}&token=${API_KEY}`,
                );
                const candleData = await candleRes.json();

                let chartBars: number[] = [];
                if (candleData.c) {
                    const min = Math.min(...candleData.c);
                    const max = Math.max(...candleData.c);
                    chartBars = candleData.c.map(
                        (val: number) => ((val - min) / (max - min)) * 100,
                    );
                }

                return {
                    id: symbol,
                    name:
                        symbol === "AAPL"
                            ? "Apple Inc."
                            : symbol === "TSLA"
                              ? "Tesla Motors"
                              : symbol === "MSFT"
                                ? "Microsoft"
                                : "Nvidia Corp",
                    price: quoteData.c,
                    color:
                        quoteData.dp >= 0
                            ? "text-emerald-500"
                            : "text-destructive",
                    chart:
                        chartBars.length > 0
                            ? chartBars.slice(-15)
                            : [40, 50, 60, 45, 70, 80],
                };
            }),
        );
        setStocks(results);
        setIsLoading(false);
    } catch (error) {
        console.error("API Error:", error);
        setIsLoading(false);
    }
};
