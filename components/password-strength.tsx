"use client";

import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
    password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const requirements = [
        { label: "Kamida 8 ta belgi", test: (p: string) => p.length >= 8 },
        {
            label: "Katta va kichik harflar",
            test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
        },
        { label: "Raqamlar", test: (p: string) => /\d/.test(p) },
        {
            label: "Maxsus belgilar (!@#$%^&*)",
            test: (p: string) => /[^A-Za-z0-9]/.test(p),
        },
    ];

    const score = requirements.filter((r) => r.test(password)).length;

    const getStrengthColor = () => {
        if (score === 0) return "bg-muted";
        if (score <= 2) return "bg-destructive";
        if (score === 3) return "bg-yellow-500";
        return "bg-emerald-500";
    };

    if (!password) return null;

    return (
        <div className="space-y-3 pt-2 animate-in fade-in duration-300">
            <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`h-full w-full rounded-full transition-colors duration-500 ${
                            step <= score ? getStrengthColor() : "bg-muted"
                        }`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirements.map((req, index) => {
                    const isMet = req.test(password);
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-[11px]"
                        >
                            {isMet ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <X className="h-3 w-3 text-muted-foreground/50" />
                            )}
                            <span
                                className={
                                    isMet
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                {req.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
