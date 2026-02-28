"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { language, setLanguage, dictionary } = useLanguage();

  if (!dictionary) return null;

  const getLanguageDetails = (locale: string) => {
    switch (locale) {
      case "en":
        return { name: dictionary.language?.english || "English", flagClass: "fi fi-gb" };
      case "ar":
        return { name: dictionary.language?.arabic || "العربية", flagClass: "fi fi-ae" };
      default:
        return { name: locale, flagClass: "fi fi-un" };
    }
  };

  const currentDetails = getLanguageDetails(language);

  const locales = ["en", "ar"];

  return (
    <DropdownMenu dir="ltr">
      {/* Responsive Trigger */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-0 md:px-2 hover:bg-accent/80 transition-colors shrink-0">
          <span className={`text-xl md:text-lg leading-none rounded-sm overflow-hidden ${currentDetails.flagClass}`} />
          <span className="hidden md:block text-sm font-medium">{currentDetails.name}</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent align="end" className="p-2 min-w-[120px]">
        {locales.map((locale) => {
          const details = getLanguageDetails(locale);
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => setLanguage(locale as "en" | "ar")}
              className={`flex items-center gap-3 cursor-pointer rounded-md p-2 m-1 ${language === locale ? "bg-primary/10 font-bold text-primary" : "text-muted-foreground"
                }`}
            >
              <span className={`text-xl leading-none rounded-sm overflow-hidden ${details.flagClass}`} />
              <span>{details.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
