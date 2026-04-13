"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader } from "@/components/ui/loader";
import { User, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const t = useTranslations("Profile");

    useEffect(() => {
        const getProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile({ ...data, email: user.email });
            }
            setLoading(false);
        };
        getProfile();
    }, []);

    if (loading) return <Loader />;

    return (
        <main className="max-w-2xl mx-auto pt-24 pb-12 px-6">
            <h1 className="text-3xl font-black mb-8 tracking-tighter">
                {t("title")}
            </h1>

            <div className="bg-card border border-border rounded-[32px] p-8 space-y-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                            {t("fullNameLabel")}
                        </p>
                        <p className="text-xl font-bold tracking-tight">
                            {profile?.full_name || t("notSet")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Mail className="w-7 h-7 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                            {t("emailLabel")}
                        </p>
                        <p className="text-xl font-bold tracking-tight">
                            {profile?.email}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
