"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getDictionary, type Dictionary } from "@/app/[lang]/dictionaries"
import { useEffect, useState } from "react"

export function NavbarLinks({ lang }: { lang: "en" | "ar" }) {
  const location = usePathname()
  const [dict, setDict] = useState<Dictionary | null>(null)
  const isRtl = lang === "ar"

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    loadDictionary()
  }, [lang])

  if (!dict) return null

  const navbarLinks = [
    {
      id: 0,
      name: dict.navigation.home,
      href: `/${lang}`,
    },
    {
      id: 1,
      name: dict.navigation.allProducts,
      href: `/${lang}/products/all`,
    },
    {
      id: 2,
      name: dict.navigation.cosmetics,
      href: `/${lang}/products/cosmetics`,
    },
    {
      id: 3,
      name: dict.navigation.perfume,
      href: `/${lang}/products/perfume`,
    },
    {
      id: 4,
      name: dict.navigation.beauty,
      href: `/${lang}/products/beauty`,
    },
  ]

  return (
    <div className={`hidden md:flex justify-center items-center gap-x-2 ${isRtl ? "mr-8" : "ml-8"}`}>
      {navbarLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href ? "bg-muted" : "hover:bg-muted hover:bg-opacity-75",
            "group p-2 font-medium rounded-md",
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

