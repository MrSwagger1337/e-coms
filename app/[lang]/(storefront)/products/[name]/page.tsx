import { Suspense } from "react"
import { getProductsByCategory } from "@/app/lib/getProductsByCategory"
import { AnimatedHeading } from "@/app/[lang]/(storefront)/components/AnimatedHeading"
import { ProductList } from "@/app/[lang]/(storefront)/components/ProductList"
import { getDictionary } from "@/app/[lang]/dictionaries"

export default async function CategoriesPage({
  params,
}: {
  params: { name: string; lang: "en" | "ar" }
}) {
  const { data, title } = await getProductsByCategory(params.name)
  const dict = await getDictionary(params.lang)
  const isRtl = params.lang === "ar"

  // Map the English title to the localized title
  let localizedTitle = title
  if (params.name === "all") {
    localizedTitle = dict.categories.all
  } else if (params.name === "cosmetics") {
    localizedTitle = dict.categories.cosmetics
  } else if (params.name === "perfume") {
    localizedTitle = dict.categories.perfume
  } else if (params.name === "beauty") {
    localizedTitle = dict.categories.beauty
  }

  return (
    <div className="bg-white">
      <section className={`max-w-7xl mx-auto min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? "rtl" : ""}`}>
        <AnimatedHeading title={localizedTitle} lang={params.lang} />
        <Suspense fallback={<div>{isRtl ? "جاري التحميل..." : "Loading..."}</div>}>
          <ProductList initialProducts={data} lang={params.lang} />
        </Suspense>
      </section>
    </div>
  )
}

