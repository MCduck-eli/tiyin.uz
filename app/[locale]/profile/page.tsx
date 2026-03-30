"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader } from "@/components/ui/loader";
import { User, Mail, Calendar } from "lucide-react";

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        <main className="max-w-2xl mx-auto pt-20 px-6">
            <h1 className="text-3xl font-black mb-8">Mening profilim</h1>
            <div className="bg-card border border-border rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            To'liq ism
                        </p>
                        <p className="text-xl font-bold">
                            {profile?.full_name || "Kiritilmagan"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Email manzili
                        </p>
                        <p className="text-xl font-bold">{profile?.email}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
