"use client"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { locales } from "@/middleware"

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    // Get the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${currentLang}`, "")

    // Navigate to the same page but with the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={locale === currentLang ? "default" : "outline"}
          size="sm"
          onClick={() => handleLanguageChange(locale)}
          className="text-xs"
        >
          {locale === "en" ? "English" : "العربية"}
        </Button>
      ))}
    </div>
  )
}

