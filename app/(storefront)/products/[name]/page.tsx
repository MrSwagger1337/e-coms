"use client"

import { Suspense, useEffect, useState } from "react"
import { AnimatedHeading } from "@/app/components/storefront/AnimatedHeading"
import { ProductList } from "@/app/components/storefront/ProductList"
import { useLanguage } from "@/app/context/LanguageContext"
import { useParams } from "next/navigation"
import type { Product } from "@/app/lib/getProductsByCategory"

export default function CategoriesPage() {
  const { dictionary, isRtl } = useLanguage()
  const params = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryTitle, setCategoryTitle] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/category/${params.name}`)
        const data = await response.json()
        setProducts(data.products)

        // Set localized category title
        if (dictionary) {
          if (params.name === "all") {
            setCategoryTitle(dictionary.categories.all)
          } else if (params.name === "cosmetics") {
            setCategoryTitle(dictionary.categories.cosmetics)
          } else if (params.name === "perfume") {
            setCategoryTitle(dictionary.categories.perfume)
          } else if (params.name === "beauty") {
            setCategoryTitle(dictionary.categories.beauty)
          } else {
            setCategoryTitle(data.title)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.name && dictionary) {
      fetchProducts()
    }
  }, [params.name, dictionary])

  if (!dictionary || loading) {
    return <div className="flex justify-center items-center min-h-[55vh]">Loading...</div>
  }

  return (
    <div className="bg-white">
      <section className={`max-w-7xl mx-auto min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? "rtl" : ""}`}>
        <AnimatedHeading title={categoryTitle} />
        <Suspense fallback={<div>{isRtl ? "جاري التحميل..." : "Loading..."}</div>}>
          <ProductList initialProducts={products} />
        </Suspense>
      </section>
    </div>
  )
}

