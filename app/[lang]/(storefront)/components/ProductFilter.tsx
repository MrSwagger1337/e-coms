"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Dictionary } from "@/app/[lang]/dictionaries"

type FilterProps = {
  categories: string[]
  onFilterChange: (category: string) => void
  lang: "en" | "ar"
  dict: Dictionary
}

export function ProductFilter({ categories, onFilterChange, lang, dict }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const isRtl = lang === "ar"

  const handleFilterClick = (category: string) => {
    setActiveFilter(category)
    onFilterChange(category)
  }

  const getCategoryName = (category: string) => {
    if (category === "all") return dict.categories.all
    if (category === "cosmetics") return dict.categories.cosmetics
    if (category === "perfume") return dict.categories.perfume
    if (category === "beauty") return dict.categories.beauty
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

