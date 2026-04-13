import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ locale: string }> },
) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const resolvedParams = await params;
    const locale = resolvedParams.locale || "uz";
    const next = searchParams.get("next") ?? `/${locale}`;
    const response = NextResponse.redirect(`${origin}${next}`);

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                        response.cookies.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: "", ...options });
                        response.cookies.set({ name, value: "", ...options });
                    },
                },
            },
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return response;
        }
    }
    return NextResponse.redirect(`${origin}/${locale}?error=auth-code-error`);
}
