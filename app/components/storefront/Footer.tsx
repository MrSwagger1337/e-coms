"use client"

import { useLanguage } from "@/app/context/LanguageContext"

export function Footer() {
  const { isRtl } = useLanguage()
  const textAlign = isRtl ? "text-right" : "text-left"

  return (
    <footer className={`mt-16 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${textAlign}`}>
      <div className="border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
        <p className="text-xs leading-5 text-gray-700">
          &copy; 2024 Bulgarian Rose. {isRtl ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
        </p>
      </div>
    </footer>
  )
}

