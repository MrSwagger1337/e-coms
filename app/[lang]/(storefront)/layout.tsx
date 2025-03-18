import type { ReactNode } from "react"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { getDictionary } from "../dictionaries"

export default async function StoreFrontLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { lang: "en" | "ar" }
}) {
  const dict = await getDictionary(params.lang)
  const isRtl = params.lang === "ar"

  return (
    <div
      className={`bg-gradient-to-b from-gray-50 from-25% via-pink-400 via-40% to-white to-70% ${isRtl ? "rtl" : "ltr"}`}
    >
      <Navbar lang={params.lang} />
      <main className="w-full">{children}</main>
      <Footer lang={params.lang} />
    </div>
  )
}

