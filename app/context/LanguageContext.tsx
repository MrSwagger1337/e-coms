"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCookie, setCookie } from "cookies-next"
import { getDictionary, type Dictionary } from "@/app/lib/dictionaries"

type LanguageContextType = {
  language: "en" | "ar"
  dictionary: Dictionary | null
  setLanguage: (lang: "en" | "ar") => void
  isRtl: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get initial language from cookie or default to 'en'
  const [language, setLanguageState] = useState<"en" | "ar">("en")
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)
  const isRtl = language === "ar"

  // Load initial language from cookie when component mounts
  useEffect(() => {
    const savedLanguage = (getCookie("language") as "en" | "ar") || "en"
    setLanguageState(savedLanguage)
  }, [])

  // Load dictionary when language changes
  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(language)
      setDictionary(dict)

      // Update document direction
      document.documentElement.dir = isRtl ? "rtl" : "ltr"
      document.documentElement.lang = language
    }

    loadDictionary()
  }, [language, isRtl])

  // Function to change language
  const setLanguage = (lang: "en" | "ar") => {
    setLanguageState(lang)
    setCookie("language", lang, { maxAge: 60 * 60 * 24 * 365 }) // 1 year expiry
  }

  return (
    <LanguageContext.Provider value={{ language, dictionary, setLanguage, isRtl }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

