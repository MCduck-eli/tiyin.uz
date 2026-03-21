"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setMsg("Xatolik: " + error.message);
        } else {
            setMsg(
                "Parol muvaffaqiyatli yangilandi! Login qilishingiz mumkin.",
            );
            setTimeout(() => router.push("/"), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md p-8 bg-background/60 backdrop-blur-xl border border-border rounded-[32px] space-y-6">
                <h1 className="text-2xl font-bold text-center">Yangi parol</h1>
                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Yangi parolni kiriting</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-xl"
                            required
                            minLength={6}
                        />
                    </div>
                    {msg && (
                        <p className="text-sm text-center font-medium">{msg}</p>
                    )}
                    <Button
                        type="submit"
                        className="w-full rounded-xl h-11"
                        disabled={loading}
                    >
                        {loading ? "Yangilanmoqda..." : "Parolni saqlash"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
