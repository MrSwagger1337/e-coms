"use client"

import { CategoriesSelection } from "../components/storefront/CategorySelection"
import { FeaturedProducts } from "../components/storefront/FeaturedProducts"
import { LandingHeader } from "../components/storefront/LandingHeader"
import { useLanguage } from "../context/LanguageContext"

export default function IndexPage() {
  const { isRtl } = useLanguage()

  return (
    <div className={`max-w-7xl mx-auto ${isRtl ? "rtl" : ""}`}>
      <LandingHeader />

      <div className="max-w-screen-2xl mx-auto hidden md:block my-12">
        <img src="./hero_banner.png" className="md:w-full" />
      </div>
      <FeaturedProducts />
      <CategoriesSelection />
    </div>
  )
}

