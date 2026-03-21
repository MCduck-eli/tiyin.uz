"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/dictionary";

type LanguageContextType = {
    lang: Language;
    setLang: (lang: Language) => void;
    t: any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>("uz");

    useEffect(() => {
        const saved = localStorage.getItem("lang") as Language;
        if (saved) setLang(saved);
    }, []);

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem("lang", newLang);
    };

    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context)
        throw new Error("useTranslation must be used within LanguageProvider");
    return context;
};
