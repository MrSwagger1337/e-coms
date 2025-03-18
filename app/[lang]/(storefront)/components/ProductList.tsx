"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/app/[lang]/(storefront)/components/ProductCard"
import { ProductFilter } from "@/app/[lang]/(storefront)/components/ProductFilter"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/app/lib/getProductsByCategory"
import { getDictionary, type Dictionary } from "@/app/[lang]/dictionaries"

export function ProductList({
  initialProducts,
  lang,
}: {
  initialProducts: Product[]
  lang: "en" | "ar"
}) {
  const [products] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const isRtl = lang === "ar"

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    loadDictionary()
  }, [lang])

  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))]

  const handleFilterChange = (category: string) => {
    if (category === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === category))
    }
  }

  if (!dict) return null

  return (
    <>
      <ProductFilter categories={categories} onFilterChange={handleFilterChange} lang={lang} dict={dict} />
      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard item={item} lang={lang} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

