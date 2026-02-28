"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/middleware";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${currentLang}`, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const getLanguageDetails = (locale: string) => {
    switch (locale) {
      case "en":
        return { name: "English", flag: "🇬🇧" };
      case "ar":
        return { name: "العربية", flag: "🇦🇪" };
      default:
        return { name: locale, flag: "🌐" };
    }
  };

  const currentDetails = getLanguageDetails(currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden md:flex gap-2 px-2 hover:bg-accent/80 transition-colors shrink-0">
          <span className="text-lg leading-none">{currentDetails.flag}</span>
          <span className="text-sm font-medium">{currentDetails.name}</span>
        </Button>
      </DropdownMenuTrigger>
      {/* Mobile Trigger */}
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="px-0 shrink-0">
          <span className="text-xl leading-none">{currentDetails.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2">
        {locales.map((locale) => {
          const details = getLanguageDetails(locale);
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`flex items-center gap-3 cursor-pointer rounded-md p-2 m-1 ${currentLang === locale ? "bg-primary/10 font-bold text-primary" : "text-muted-foreground"
                }`}
            >
              <span className="text-xl leading-none">{details.flag}</span>
              <span>{details.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
