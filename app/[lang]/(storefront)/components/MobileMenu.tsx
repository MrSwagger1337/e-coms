"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getDictionary, type Dictionary } from "@/app/[lang]/dictionaries";
import { useEffect, useState } from "react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export function MobileMenu({ lang, isAuth }: { lang: "en" | "ar", isAuth: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = usePathname();
    const [dict, setDict] = useState<Dictionary | null>(null);
    const isRtl = lang === "ar";

    useEffect(() => {
        const loadDictionary = async () => {
            const dictionary = await getDictionary(lang);
            setDict(dictionary);
        };
        loadDictionary();
    }, [lang]);

    if (!dict) return null;

    const navbarLinks = [
        { id: 0, name: dict.navigation.home, href: `/${lang}` },
        { id: 1, name: dict.navigation.allProducts, href: `/${lang}/products/all` },
        { id: 2, name: dict.navigation.cosmetics, href: `/${lang}/products/cosmetics` },
        { id: 3, name: dict.navigation.perfume, href: `/${lang}/products/perfume` },
        { id: 4, name: dict.navigation.beauty, href: `/${lang}/products/beauty` },
    ];

    return (
        <div className="flex md:hidden items-center ml-2 mr-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side={isRtl ? "right" : "left"} className="w-[300px] sm:w-[400px]">
                    <SheetHeader className={isRtl ? "text-right" : "text-left"}>
                        <SheetTitle>
                            {isRtl ? "القائمة" : "Menu"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                        <div className="flex flex-col gap-2">
                            {navbarLinks.map((item) => (
                                <Link
                                    href={item.href}
                                    key={item.id}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        location === item.href
                                            ? "bg-muted font-bold text-primary"
                                            : "hover:bg-muted font-medium text-foreground",
                                        "block px-4 py-3 rounded-md transition-colors",
                                        isRtl ? "text-right" : "text-left"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {!isAuth && (
                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                                <Button variant="outline" asChild className="w-full justify-center">
                                    <LoginLink>{lang === "en" ? "Sign in" : "تسجيل الدخول"}</LoginLink>
                                </Button>
                                <Button asChild className="w-full justify-center">
                                    <RegisterLink>{lang === "en" ? "Create Account" : "إنشاء حساب"}</RegisterLink>
                                </Button>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
