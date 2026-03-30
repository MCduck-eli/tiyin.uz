import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// i18n/request.ts yo'li rasmda ko'ringan i18n papkang ichida bo'lishi shart
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    // Agar boshqa sozlamalaring bo'lsa shu yerga yoziladi
};

export default withNextIntl(nextConfig);
