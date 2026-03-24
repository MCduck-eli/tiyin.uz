"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, MessageSquare, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "ai";
    content: string;
}

export const AICounselor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: input };
        const currentHistory = [...messages, userMsg];

        setMessages(currentHistory);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: input,
                    history: messages,
                }),
            });

            const data = await response.json();

            const aiMsg: Message = { role: "ai", content: data.reply };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = {
                role: "ai",
                content:
                    "Kechirasiz, texnik nosozlik. Iltimos, @e_halikov ga murojaat qiling.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 flex items-center justify-center group border border-white/10"
            >
                <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20 group-hover:hidden" />
                <Bot className="w-8 h-8 relative z-10" />
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-background/20 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "100%", opacity: 0.5 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0.5 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="fixed top-0 right-0 h-full w-full md:w-100 bg-card border-l border-border z-[60] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        <span className="text-primary-foreground font-bold text-sm">
                                            T
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase tracking-tighter text-sm">
                                            Tiyin AI
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                Maslahatchi tayyor
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-4"
                            >
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-2">
                                            <MessageSquare className="w-10 h-10 text-primary/20" />
                                        </div>
                                        <h4 className="text-xl font-black uppercase italic tracking-tighter">
                                            Qanday yordam bera olaman?
                                        </h4>
                                        <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[250px]">
                                            Bozor tahlili, xarajatlar tahlili
                                            yoki moliyaviy rejalashtirish
                                            bo'yicha savollaringizni bering.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${
                                                    msg.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className="flex justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-border bg-background">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleSend()
                                        }
                                        placeholder="Savolingizni yozing..."
                                        className="w-full bg-muted border border-border rounded-2xl py-4 px-5 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
