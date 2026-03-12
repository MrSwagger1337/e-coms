"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Dictionary } from "@/app/[lang]/dictionaries"

type CategoryData = {
  id: string
  name: string
  title: string
  title_ar: string | null
}

type FilterProps = {
  categories: string[] // List of category *slugs* actually present in the products 
  onFilterChange: (category: string) => void
  lang: "en" | "ar"
  dict: Dictionary
}

export function ProductFilter({ categories, onFilterChange, lang, dict }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [categoryMap, setCategoryMap] = useState<Record<string, CategoryData>>({})
  const isRtl = lang === "ar"

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: CategoryData[]) => {
        const map: Record<string, CategoryData> = {}
        data.forEach((cat) => {
          map[cat.name] = cat
        })
        setCategoryMap(map)
      })
      .catch(() => { })
  }, [])

  const handleFilterClick = (category: string) => {
    setActiveFilter(category)
    onFilterChange(category)
  }

  const getCategoryName = (category: string) => {
    if (category === "all") return dict.categories?.all || "All Products"

    // Check dynamic categories from database first
    const catInfo = categoryMap[category]
    if (catInfo) {
      return isRtl && catInfo.title_ar ? catInfo.title_ar : catInfo.title
    }

    // Fallback if network request to /api/categories fails or is loading
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className={`flex flex-wrap justify-center gap-4 mb-8 pt-5 md:pt-0 ${isRtl ? "flex-row-reverse" : ""}`}>
      {categories.map((category) => (
        <motion.button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === category
              ? "bg-pink-500 text-white shadow-md"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          onClick={() => handleFilterClick(category)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {getCategoryName(category)}
        </motion.button>
      ))}
    </div>
  )
}
