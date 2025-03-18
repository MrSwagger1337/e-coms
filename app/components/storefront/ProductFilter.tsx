"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/app/context/LanguageContext"

type FilterProps = {
  categories: string[]
  onFilterChange: (category: string) => void
}

export function ProductFilter({ categories, onFilterChange }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const { dictionary, isRtl } = useLanguage()

  if (!dictionary) return null

  const handleFilterClick = (category: string) => {
    setActiveFilter(category)
    onFilterChange(category)
  }

  const getCategoryName = (category: string) => {
    if (category === "all") return dictionary.categories.all
    if (category === "cosmetics") return dictionary.categories.cosmetics
    if (category === "perfume") return dictionary.categories.perfume
    if (category === "beauty") return dictionary.categories.beauty
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className={`flex flex-wrap justify-center gap-4 mb-8 pt-5 md:pt-0 ${isRtl ? "flex-row-reverse" : ""}`}>
      {categories.map((category) => (
        <motion.button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === category ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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

