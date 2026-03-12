"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getDictionary, type Dictionary } from "@/app/[lang]/dictionaries"
import { useEffect, useState } from "react"

export function NavbarLinks({ lang }: { lang: "en" | "ar" }) {
  const location = usePathname()
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string; title: string; title_ar: string | null }[]>([])
  const isRtl = lang === "ar"

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    loadDictionary()

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => { })
  }, [lang])

  if (!dict) return null

  const baseLinks = [
    {
      id: "home",
      name: dict.navigation.home,
      href: `/${lang}`,
    },
    {
      id: "all",
      name: dict.navigation.allProducts,
      href: `/${lang}/products/all`,
    },
  ]

  const categoryLinks = categories.map((cat) => ({
    id: cat.id,
    name: isRtl && cat.title_ar ? cat.title_ar : cat.title,
    href: `/${lang}/products/${cat.name}`,
  }))

  const navbarLinks = [...baseLinks, ...categoryLinks]

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
