import Image from "next/image"
import Link from "next/link"
import all from "@/public/all.jpeg"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { cn } from "@/lib/utils"
import prisma from "@/app/lib/db"

async function SaleHeading4({ className, category, isRtl }: { className?: string; category: string; isRtl: boolean }) {
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

export async function CategoriesSelection({ lang }: { lang: "en" | "ar" }) {
  const dict = await getDictionary(lang)
  const isRtl = lang === "ar"

  // Fetch dynamic categories
  const categories = await prisma.categoryInfo.findMany({
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="py-24 sm:py-32">
      <div className={`flex justify-between items-center ${isRtl ? "flex-row-reverse" : ""}`}>
        <SaleHeading4 category={dict.shopBy.category} isRtl={isRtl} />

        <Link className="text-sm font-semibold text-primary hover:text-primary/80" href={`/${lang}/products/all`}>
          {isRtl ? `← ${dict.categories.all}` : `${dict.categories.all} →`}
        </Link>
      </div>

      <div className={`mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:gap-8 ${categories.length > 0 ? "sm:grid-rows-2" : ""}`}>
        {/* All Products Card */}
        <div className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden sm:aspect-w-1 sm:row-span-2">
          <Image src={all || "/placeholder.svg"} alt="All Products Image" className="object-cover object-center " />
          <div className="bg-gradient-to-b from-transparent to-black opacity-55" />
          <div className={`p-6 flex items-end ${isRtl ? "text-right" : ""}`}>
            <Link href={`/${lang}/products/all`}>
              <h3 className="text-white font-semibold">{dict.categories.all}</h3>
              <p className="mt-1 text-sm text-white">{dict.shopBy.shopNow}</p>
            </Link>
          </div>
        </div>

        {/* Dynamic Category Cards */}
        {categories.map((cat) => (
          <div key={cat.id} className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full shadow-md">
            {cat.imageString ? (
              <Image
                src={cat.imageString}
                alt={`${cat.title} Image`}
                width={600}
                height={400}
                className="object-bottom object-cover sm:absolute sm:inset-0 sm:w-full sm:h-full"
              />
            ) : (
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 sm:absolute sm:inset-0 sm:w-full sm:h-full" />
            )}
            <div className="bg-gradient-to-b from-transparent to-black opacity-55 sm:absolute sm:inset-0" />
            <div className={`p-6 flex items-end sm:absolute sm:inset-0 ${isRtl ? "text-right" : ""}`}>
              <Link href={`/${lang}/products/${cat.name}`}>
                <h3 className="text-white font-semibold">
                  {isRtl && cat.title_ar ? cat.title_ar : cat.title}
                </h3>
                <p className="mt-1 text-sm text-white">{dict.shopBy.shopNow}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
