import { CategoriesSelection } from "./components/CategorySelection"
import { FeaturedProducts } from "./components/FeaturedProducts"
import { LandingHeader } from "./components/LandingHeader"
import { getDictionary } from "../dictionaries"

export default async function IndexPage({ params }: { params: { lang: "en" | "ar" } }) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="max-w-7xl mx-auto">
      <LandingHeader lang={params.lang} />


      <FeaturedProducts lang={params.lang} />
      <CategoriesSelection lang={params.lang} />
    </div>
  )
}

