"use client";

import { useState, useEffect } from "react";
import { Loader } from "@/components/ui/loader";
import { supabase } from "@/lib/supabase";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Supabase session yoki asosiy ma'lumotlarni tekshirish
            await supabase.auth.getSession();
            // Ma'lumotlar olinishi uchun biroz vaqt beramiz (miltillashni oldini olish)
            setTimeout(() => setIsLoading(false), 600);
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return <Loader />; // Butun ekranni qoplaydi, Navbar/Footer render bo'lmaydi
    }

    return <>{children}</>;
}
