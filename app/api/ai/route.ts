import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SYSTEM_PROMPT = `
Siz "Tiyin AI" aqlli moliyaviy maslahatchisiz. 

LOYIHA HAQIDA (Bu savollarga javob bering):
- Loyiha nomi: Tiyin.uz.
- Maqsadi: Murakkab jadvallardan charchaganlar uchun minimalist dizayn, maksimal natija va aqlli moliya tahlilini taqdim etish.
- Foydasi: Foydalanuvchilarga o'z xarajatlarini nazorat qilish, budjetni rejalashtirish va pulni tejash bo'yicha maslahatlar beradi.

MULOQOT VA YAKUNLASH QOIDALARI:
1. Agar foydalanuvchi "rahmat", "bo'ldi", "tushundim", "ha" kabi so'zlar bilan muloqotni tugatmoqchi bo'lsa, siz ham xushmuomalalik bilan suhbatni chiroyli yakunlang (Masalan: "Sizga yordam berganimdan xursandman! Yana savollar bo'lsa, doimo shu yerdaman.").
2. Agar foydalanuvchi moliyaga mutlaqo aloqasi bo'lmagan yoki mantiqsiz savollar bersa (mavzudan chetlashsa), quyidagicha javob bering: "Kechirasiz, men faqat moliyaviy masalalar bo'yicha yordam bera olaman. Agar qo'shimcha savollaringiz bo'lsa, @e_halikov ga Telegram orqali murojaat qilishingiz mumkin."
3. Har bir javob oxirida: "Javob foydali bo'ldimi? (Ha / Yo'q)" deb so'rang.

TEXNIK QOIDA:
- Hisob, balans yoki xarajat so'ralsa, "get_financial_summary"ni chaqiring. Texnik kodlarni (<function...>) ko'rsatmang.
- Foydalanuvchi ismi kontekstda berilgan bo'lsa, unga ismi bilan murojaat qiling.
`;

async function get_financial_summary(supabase: any) {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return { error: "AUTH_REQUIRED" };

        const { data: expenses } = await supabase
            .from("expenses")
            .select("*")
            .eq("user_id", user.id);
        const { data: profile } = await supabase
            .from("profiles")
            .select("initial_balance, full_name")
            .eq("id", user.id)
            .single();

        const initialBalance = profile?.initial_balance || 0;
        const totalSpent = (expenses || []).reduce(
            (acc: number, item: any) => acc + item.amount,
            0,
        );

        return {
            full_name: profile?.full_name || "Foydalanuvchi",
            balance: `${(initialBalance - totalSpent).toLocaleString()} so'm`,
            monthly_spending: `${totalSpent.toLocaleString()} so'm`,
            details: (expenses || [])
                .slice(0, 3)
                .map(
                    (e: any) =>
                        `${e.category}: ${e.amount.toLocaleString()} so'm`,
                ),
            status: "success",
        };
    } catch {
        return { error: "DB_ERROR" };
    }
}

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GROQ_API_KEY;
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options),
                            );
                        } catch {}
                    },
                },
            },
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        let userContext = "Foydalanuvchi: Mehmon";
        if (user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", user.id)
                .single();
            userContext = `Foydalanuvchi: ${profile?.full_name || user.email}. Holati: Tizimda.`;
        }

        const initialMessages = [
            {
                role: "system",
                content: `${SYSTEM_PROMPT}\n\nKONTEKST: ${userContext}`,
            },
            ...(history || []).map((msg: any) => ({
                role: msg.role === "ai" ? "assistant" : "user",
                content: msg.content,
            })),
            { role: "user", content: message },
        ];

        let response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: initialMessages,
                    tools: [
                        {
                            type: "function",
                            function: {
                                name: "get_financial_summary",
                                description: "Hisobni tekshirish",
                                parameters: { type: "object", properties: {} },
                            },
                        },
                    ],
                    tool_choice: "auto",
                    temperature: 0.6,
                }),
            },
        );

        const data = await response.json();
        const msg = data.choices[0].message;

        if (msg.tool_calls) {
            const financialData = await get_financial_summary(supabase);
            const secondRes = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            ...initialMessages,
                            msg,
                            {
                                role: "tool",
                                tool_call_id: msg.tool_calls[0].id,
                                name: "get_financial_summary",
                                content: JSON.stringify(financialData),
                            },
                        ],
                        temperature: 0.4,
                    }),
                },
            );
            const secondData = await secondRes.json();
            return NextResponse.json({
                reply: secondData.choices[0].message.content,
            });
        }

        return NextResponse.json({ reply: msg.content });
    } catch {
        return NextResponse.json(
            { reply: "Tizimda texnik xatolik. @e_halikov bilan bog'laning." },
            { status: 500 },
        );
    }
}
