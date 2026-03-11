"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/app/context/LanguageContext"

type CategoryData = {
  id: string
  name: string
  title: string
  title_ar: string | null
}

type FilterProps = {
  categories: string[]
  onFilterChange: (category: string) => void
}

export function ProductFilter({ categories, onFilterChange }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [categoryMap, setCategoryMap] = useState<Record<string, CategoryData>>({})
  const { dictionary, isRtl } = useLanguage()

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

  if (!dictionary) return null

  const handleFilterClick = (category: string) => {
    setActiveFilter(category)
    onFilterChange(category)
  }

  const getCategoryName = (category: string) => {
    if (category === "all") return dictionary.categories.all
    // Check dynamic categories first
    const catInfo = categoryMap[category]
    if (catInfo) {
      return isRtl && catInfo.title_ar ? catInfo.title_ar : catInfo.title
    }
    // Fallback to dictionary
    const dictCategories = dictionary.categories as Record<string, string>
    if (dictCategories[category]) return dictCategories[category]
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className={`flex flex-wrap justify-center gap-4 mb-8 pt-5 md:pt-0 ${isRtl ? "flex-row-reverse" : ""}`}>
      {categories.map((category) => (
        <motion.button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === category ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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
