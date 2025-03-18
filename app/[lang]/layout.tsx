import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "../api/uploadthing/core"
import { getDictionary } from "./dictionaries"
import { locales } from "@/middleware"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bulgarian rose",
  description: "Cosmetics and perfumes Store",
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: "en" | "ar" }
}>) {
  const dict = await getDictionary(params.lang)
  const isRtl = params.lang === "ar"

  return (
    <html lang={params.lang} dir={isRtl ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </body>
    </html>
  )
}

