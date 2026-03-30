import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["uz", "ru", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;
    if (!locale || !locales.includes(locale as any)) {
        notFound();
    }
    const messages = (await import(`../messages/${locale}.json`)).default;

    return {
        locale: locale as string,
        messages: messages,
    };
});
