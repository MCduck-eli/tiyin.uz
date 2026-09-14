import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const actualIncome = Number(body.actual_income ?? body.amount ?? 0);

        if (!actualIncome || actualIncome <= 0) {
            return NextResponse.json(
                { error: "To'g'ri daromad miqdori kiritilmagan." },
                { status: 400 },
            );
        }

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
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Avtorizatsiyadan o'tilmagan." },
                { status: 401 },
            );
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GROQ_API_KEY sozlanmagan." },
                { status: 500 },
            );
        }

        const systemPrompt = `
Siz O'zbekistondagi foydalanuvchilar uchun aqlli shaxsiy moliyaviy maslahatchisiz (Tiyin AI).
Foydalanuvchining oylik daromadi: ${actualIncome} so'm.
Sizning vazifangiz:
1. Kundalik hayotda va xarajatlarda mutlaqo sezilmaydigan "micro-savings" (mikro-jamg'arma) foizini (3% dan 15% gacha oraliqda, masalan 5%, 7%, 10%) tavsiya qilish.
2. Shu foiz bo'yicha tejaladigan aniq summani hisoblash.
3. Nima uchun har oy bu kichik summani ajratib borish uzoq muddatda (1-3 yil) katta moliyaviy barqarorlik va kapital yaratishini qisqa, motivatsion va tushunarli o'zbek tilida tushuntirish.

Qat'iy talab: Faqat va faqat quyidagi JSON formatida javob bering, boshqa hech qanday ortiqcha matn qo'shmang:
{
  "suggested_percentage": 5,
  "saved_amount": 250000,
  "advice_text": "Qisqa va foydali maslahat matni"
}
`;

        const groqResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey.trim()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: [
                        { role: "system", content: systemPrompt },
                        {
                            role: "user",
                            content: `Mening bu oydagi daromadim: ${actualIncome} so'm. Menga mikro-jamg'arma rejasini JSON formatida tavsiya qiling.`,
                        },
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.5,
                }),
            },
        );

        if (!groqResponse.ok) {
            const fallbackPercentage = 7;
            const fallbackSaved = Math.round(
                (actualIncome * fallbackPercentage) / 100,
            );
            const fallbackData = {
                suggested_percentage: fallbackPercentage,
                saved_amount: fallbackSaved,
                advice_text: `Daromadingizdan har oy ${fallbackPercentage}% (${fallbackSaved.toLocaleString()} so'm) ajratib borsangiz, bir yilda ${ (fallbackSaved * 12).toLocaleString() } so'm qo'shimcha erkin kapitalga ega bo'lasiz.`,
            };

            await supabase
                .from("profiles")
                .update({
                    auto_invest_percent: fallbackData.suggested_percentage,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            return NextResponse.json({
                success: true,
                ...fallbackData,
            });
        }

        const groqData = await groqResponse.json();
        const rawContent = groqData.choices?.[0]?.message?.content || "{}";
        let aiResult: any;

        try {
            aiResult = JSON.parse(rawContent);
        } catch {
            const fallbackPercentage = 7;
            const fallbackSaved = Math.round(
                (actualIncome * fallbackPercentage) / 100,
            );
            aiResult = {
                suggested_percentage: fallbackPercentage,
                saved_amount: fallbackSaved,
                advice_text: `Daromadingizdan har oy ${fallbackPercentage}% (${fallbackSaved.toLocaleString()} so'm) ajratib borsangiz, sezilarli jamg'arma to'playsiz.`,
            };
        }

        const suggestedPercentage = Number(
            aiResult.suggested_percentage || 7,
        );
        const savedAmount = Number(
            aiResult.saved_amount ||
                Math.round((actualIncome * suggestedPercentage) / 100),
        );
        const adviceText = String(
            aiResult.advice_text ||
                "Har oylik kichik mikro-jamg'arma sizga katta moliyaviy erkinlik beradi.",
        );

        try {
            await supabase
                .from("profiles")
                .update({
                    auto_invest_percent: suggestedPercentage,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);
        } catch {}

        try {
            await supabase.from("goals").insert([
                {
                    user_id: user.id,
                    title: "AI Mikro-jamg'arma",
                    target_price: savedAmount * 12,
                    current_saved: savedAmount,
                    is_completed: false,
                    ai_monthly_income: actualIncome,
                    ai_expected_daily_expenses:
                        (actualIncome - savedAmount) / 30,
                    actual_daily_spending: (actualIncome - savedAmount) / 30,
                },
            ]);
        } catch {}

        return NextResponse.json({
            success: true,
            suggested_percentage: suggestedPercentage,
            saved_amount: savedAmount,
            advice_text: adviceText,
        });
    } catch {
        return NextResponse.json(
            { error: "Serverda kutilmagan xatolik yuz berdi." },
            { status: 500 },
        );
    }
}
