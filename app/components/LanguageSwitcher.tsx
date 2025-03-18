"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/context/LanguageContext"

export function LanguageSwitcher() {
  const { language, setLanguage, dictionary } = useLanguage()

  if (!dictionary) return null

  return (
    <div className="flex gap-2">
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="text-xs"
      >
        {dictionary.language.english}
      </Button>
      <Button
        variant={language === "ar" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("ar")}
        className="text-xs"
      >
        {dictionary.language.arabic}
      </Button>
    </div>
  )
}

