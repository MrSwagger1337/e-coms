"use client"

import Image from "next/image"
import Link from "next/link"
import all from "@/public/all.jpeg"
import men from "@/public/men.jpeg"
import women from "@/public/women.jpeg"
import { useLanguage } from "@/app/context/LanguageContext"
import { cn } from "@/lib/utils"

function SaleHeading4({ className, category, isRtl }: { className?: string; category: string; isRtl: boolean }) {
  return (
    <h2 className={cn("text-5xl font-extrabold tracking-tight mb-8 relative leading-tight", className)}>
      <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
        {isRtl ? `${category} حسب` : `Shop by `}
      </span>
      <span className="relative inline-block group">
        <span className="relative z-10 text-white px-6 py-2 font-black tracking-wider">{isRtl ? "" : category}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 transform skew-x-12 shadow-lg group-hover:shadow-xl transition-shadow duration-300"></span>
        <span
          className={`absolute ${isRtl ? "-right-3 -left-3" : "-left-3 -right-3"} h-1/2 bg-gradient-to-r from-pink-600 to-pink-700 top-full shadow-md`}
        ></span>
      </span>
    </h2>
  )
}

export function CategoriesSelection() {
  const { dictionary, isRtl } = useLanguage()

  if (!dictionary) return null

  return (
    <div className="py-24 sm:py-32 relative">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      
      <div className={`flex justify-between items-center ${isRtl ? "flex-row-reverse" : ""}`}>
        <SaleHeading4 category={dictionary.shopBy.category} isRtl={isRtl} />

        <Link className="group text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-200 flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20" href="/products/all">
          <span>{dictionary.categories.all}</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            {isRtl ? "←" : "→"}
          </span>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-8 lg:gap-10">
        <div className="group aspect-w-2 aspect-h-1 rounded-2xl overflow-hidden sm:aspect-w-1 sm:row-span-2 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
          <Image src={all || "/placeholder.svg"} alt="All Products Image" className="object-cover object-center transition-transform duration-700 group-hover:scale-110" />
          <div className="bg-gradient-to-b from-transparent via-transparent to-black/70 group-hover:to-black/80 transition-all duration-300" />
          <div className={`p-8 flex items-end ${isRtl ? "text-right" : ""}`}>
            <Link href="/products/all" className="group/link">
              <h3 className="text-white font-bold text-2xl mb-2 group-hover/link:text-pink-200 transition-colors duration-200">{dictionary.categories.all}</h3>
              <p className="text-white/90 text-base group-hover/link:text-white transition-colors duration-200">{dictionary.shopBy.shopNow}</p>
            </Link>
          </div>
        </div>

        <div className="group aspect-w-2 aspect-h-1 rounded-2xl overflow-hidden sm:relative sm:aspect-none sm:h-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <Image
            src={men || "/placeholder.svg"}
            alt="Products for men Image"
            className="object-bottom object-cover sm:absolute sm:inset-0 sm:w-full sm:h-full transition-transform duration-700 group-hover:scale-110"
          />
          <div className="bg-gradient-to-b from-transparent to-black/70 sm:absolute sm:inset-0 group-hover:to-black/80 transition-all duration-300" />
          <div className={`p-8 flex items-end sm:absolute sm:inset-0 ${isRtl ? "text-right" : ""}`}>
            <Link href="/products/cosmetics" className="group/link">
              <h3 className="text-white font-bold text-xl mb-2 group-hover/link:text-pink-200 transition-colors duration-200">{dictionary.categories.cosmetics}</h3>
              <p className="text-white/90 group-hover/link:text-white transition-colors duration-200">{dictionary.shopBy.shopNow}</p>
            </Link>
          </div>
        </div>

        <div className="group aspect-w-2 aspect-h-1 rounded-2xl overflow-hidden sm:relative sm:aspect-none sm:h-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <Image
            src={women || "/placeholder.svg"}
            alt="Women product image"
            className="object-bottom object-cover sm:absolute sm:inset-0 sm:w-full sm:h-full transition-transform duration-700 group-hover:scale-110"
          />
          <div className="bg-gradient-to-b from-transparent to-black/70 sm:absolute sm:inset-0 group-hover:to-black/80 transition-all duration-300" />
          <div className={`p-8 flex items-end sm:absolute sm:inset-0 ${isRtl ? "text-right" : ""}`}>
            <Link href="/products/perfume" className="group/link">
              <h3 className="text-white font-bold text-xl mb-2 group-hover/link:text-pink-200 transition-colors duration-200">{dictionary.categories.perfume}</h3>
              <p className="text-white/90 group-hover/link:text-white transition-colors duration-200">{dictionary.shopBy.shopNow}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

