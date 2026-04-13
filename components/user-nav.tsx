"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { LogOut, User, Settings, CreditCard } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function UserNav({ user }: { user: any }) {
    const t = useTranslations("UserNav");
    const locale = useLocale();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const initials = user?.email?.charAt(0).toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
                >
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage
                            src={user?.user_metadata?.avatar_url}
                            alt="Avatar"
                        />
                        <AvatarFallback className="bg-muted text-xs font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-[20px] mt-2"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.user_metadata?.full_name || t("defaultUser")}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={`/${locale}/profile`}>
                        <DropdownMenuItem className="cursor-pointer rounded-lg">
                            <User className="mr-2 h-4 w-4" />
                            <span>{t("profile")}</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/${locale}/expenses`}>
                        <DropdownMenuItem className="cursor-pointer rounded-lg">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>{t("expenses")}</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/${locale}/settings`}>
                        <DropdownMenuItem className="cursor-pointer rounded-lg">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t("settings")}</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
