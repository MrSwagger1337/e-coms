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
    <h2 className={cn("text-4xl font-extrabold tracking-tight mb-5 relative", className)}>
      {isRtl ? `${category} حسب` : `Shop by `}
      <span className="relative inline-block">
        <span className="relative z-10 text-white px-4 py-1">{isRtl ? "" : category}</span>
        <span className="absolute inset-0 bg-pink-500 transform skew-x-12"></span>
        <span
          className={`absolute ${isRtl ? "-right-2 -left-2" : "-left-2 -right-2"} h-1/2 bg-pink-600 top-full`}
        ></span>
      </span>
    </h2>
  )
}

export function CategoriesSelection() {
  const { dictionary, isRtl } = useLanguage()

  if (!dictionary) return null

  return (
    <div className="py-24 sm:py-32">
      <div className={`flex justify-between items-center ${isRtl ? "flex-row-reverse" : ""}`}>
        <SaleHeading4 category={dictionary.shopBy.category} isRtl={isRtl} />

        <Link className="text-sm font-semibold text-primary hover:text-primary/80" href="/products/all">
          {isRtl ? `← ${dictionary.categories.all}` : `${dictionary.categories.all} →`}
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
        <div className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden sm:aspect-w-1 sm:row-span-2">
          <Image src={all || "/placeholder.svg"} alt="All Products Image" className="object-cover object-center " />
          <div className="bg-gradient-to-b from-transparent to-black opacity-55" />
          <div className={`p-6 flex items-end ${isRtl ? "text-right" : ""}`}>
            <Link href="/products/all">
              <h3 className="text-white font-semibold">{dictionary.categories.all}</h3>
              <p className="mt-1 text-sm text-white">{dictionary.shopBy.shopNow}</p>
            </Link>
          </div>
        </div>

        <div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full">
          <Image
            src={men || "/placeholder.svg"}
            alt="Products for men Image"
            className="object-bottom object-cover sm:absolute sm:inset-0 sm:w-full sm:h-full"
          />
          <div className="bg-gradient-to-b from-transparent to-black opacity-55 sm:absolute sm:inset-0" />
          <div className={`p-6 flex items-end sm:absolute sm:inset-0 ${isRtl ? "text-right" : ""}`}>
            <Link href="/products/cosmetics">
              <h3 className="text-white font-semibold">{dictionary.categories.cosmetics}</h3>
              <p className="mt-1 text-sm text-white">{dictionary.shopBy.shopNow}</p>
            </Link>
          </div>
        </div>

        <div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full">
          <Image
            src={women || "/placeholder.svg"}
            alt="Women product image"
            className="object-bottom object-cover sm:absolute sm:inset-0 sm:w-full sm:h-full"
          />
          <div className="bg-gradient-to-b from-transparent to-black opacity-55 sm:absolute sm:inset-0" />
          <div className={`p-6 flex items-end sm:absolute sm:inset-0 ${isRtl ? "text-right" : ""}`}>
            <Link href="/products/perfume">
              <h3 className="text-white font-semibold">{dictionary.categories.perfume}</h3>
              <p className="mt-1 text-sm text-white">{dictionary.shopBy.shopNow}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

