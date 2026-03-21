"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "./context/language-context";
import { FcGoogle } from "react-icons/fc";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import PasswordStrength from "./password-strength";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [view, setView] = useState<"auth" | "forgot">("auth");

    const isPasswordStrong = (p: string) => {
        return (
            p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p)
        );
    };

    const handleGoogleAuth = async () => {
        setErrorMsg(null);
        setSuccessMsg(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) setErrorMsg(error.message);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (
            type === "register" &&
            view === "auth" &&
            !isPasswordStrong(password)
        ) {
            setErrorMsg(
                "Parol juda oddiy. Iltimos, barcha talablarga javob bering.",
            );
            return;
        }

        setLoading(true);

        if (view === "forgot") {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) setErrorMsg(error.message);
            else
                setSuccessMsg(
                    "Parolni tiklash havolasi emailingizga yuborildi!",
                );
        } else if (type === "register") {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setErrorMsg(error.message);
            } else if (data.user && data.user.identities?.length === 0) {
                setErrorMsg("Bu email allaqachon ro'yxatdan o'tgan");
            } else {
                setSuccessMsg("Tasdiqlash xati emailingizga yuborildi!");
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setErrorMsg("Email yoki parol noto'g'ri");
            } else {
                window.location.reload();
            }
        }
        setLoading(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setView("auth");
                }
                onClose();
            }}
        >
            <DialogContent className="sm:max-w-100 rounded-[28px] border-border bg-background/80 backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-center">
                        {view === "forgot"
                            ? "Parolni tiklash"
                            : type === "login"
                              ? t.nav.login
                              : t.nav.getStarted}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    {errorMsg && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-in fade-in zoom-in duration-200">
                            <AlertCircle className="h-4 w-4" />
                            <p>{errorMsg}</p>
                        </div>
                    )}

                    {successMsg && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm border border-emerald-500/20 animate-in fade-in zoom-in duration-200">
                            <CheckCircle2 className="h-4 w-4" />
                            <p>{successMsg}</p>
                        </div>
                    )}

                    {!successMsg && (
                        <>
                            {view === "auth" && (
                                <Button
                                    variant="outline"
                                    onClick={handleGoogleAuth}
                                    className="w-full rounded-xl h-11 border-border bg-background/50 hover:bg-muted font-medium flex items-center gap-2"
                                >
                                    <FcGoogle className="w-5 h-5" />
                                    Google orqali davom etish
                                </Button>
                            )}

                            {view === "auth" && (
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-transparent px-2 text-muted-foreground">
                                            Yoki
                                        </span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@mail.com"
                                        className="rounded-xl bg-muted/50 border-none"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                {view === "auth" && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setView("forgot")
                                                }
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Unutdingizmi?
                                            </button>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="****"
                                            className="rounded-xl bg-muted/50 border-none"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                        {type === "register" && (
                                            <PasswordStrength
                                                password={password}
                                            />
                                        )}
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full rounded-xl h-11 font-medium"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "..."
                                        : view === "forgot"
                                          ? "Yuborish"
                                          : type === "login"
                                            ? "Kirish"
                                            : "Ro'yxatdan o'tish"}
                                </Button>
                                {view === "forgot" && (
                                    <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={() => setView("auth")}
                                        className="w-full text-xs"
                                    >
                                        Orqaga qaytish
                                    </Button>
                                )}
                            </form>
                        </>
                    )}

                    {successMsg && (
                        <Button
                            onClick={onClose}
                            className="w-full rounded-xl h-11"
                        >
                            Tushunarli
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
