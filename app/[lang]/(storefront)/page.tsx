import { CategoriesSelection } from "./components/CategorySelection"
import { FeaturedProducts } from "./components/FeaturedProducts"
import { LandingHeader } from "./components/LandingHeader"
import { getDictionary } from "../dictionaries"

export default async function IndexPage({ params }: { params: { lang: "en" | "ar" } }) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="max-w-7xl mx-auto">
      <LandingHeader lang={params.lang} />

      <div className="max-w-screen-2xl mx-auto hidden md:block my-12">
        <img src="./hero_banner.png" className="md:w-full" />
      </div>
      <FeaturedProducts lang={params.lang} />
      <CategoriesSelection lang={params.lang} />
    </div>
  )
}

