import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://tiyin-uz.vercel.app";
    const locales = ["uz", "ru", "en"];
    const pages = ["", "expenses", "goals", "news", "stocks"];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    locales.forEach((lang) => {
        pages.forEach((page) => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}${page ? "/" + page : ""}`,
                lastModified: new Date(),
                changeFrequency: "daily",
                priority: page === "" ? 1 : 0.8,
            });
        });
    });

    return sitemapEntries;
}
