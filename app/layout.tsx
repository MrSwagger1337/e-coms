import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "./api/uploadthing/core"
import { LanguageProvider } from "./context/LanguageContext"
import { CountdownGuard } from "./components/CountdownGuard"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bulgarianrose.ae";

import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const language = cookieStore.get("language")?.value || "en";
  const isAr = language === "ar";

  const titleDefault = isAr ? "الوردة البلغارية | متجر مستحضرات التجميل والعطور" : "Bulgarian rose | Cosmetics and Perfumes";
  const titleTemplate = isAr ? "%s | الوردة البلغارية" : "%s | Bulgarian rose";
  const description = isAr
    ? "متجر مستحضرات أصلية وعطور فاخرة يقدم منتجات الوردة البلغارية عالية الجودة."
    : "Premium cosmetics and perfumes store offering high-quality Bulgarian rose products.";
  const siteName = isAr ? "الوردة البلغارية" : "Bulgarian rose";
  const locale = isAr ? "ar_AE" : "en_US";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description: description,
    generator: 'v0.dev',
    keywords: ["Bulgarian rose", "cosmetics", "perfumes", "beauty products", "skincare", "الوردة البلغارية", "مستحضرات تجميل", "عطور", "العناية بالبشرة"],
    openGraph: {
      type: "website",
      locale: locale,
      url: SITE_URL,
      title: titleDefault,
      description: description,
      siteName: siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description: description,
    },
    icons: {
      icon: '/favicon.ico?v=2',
      shortcut: '/favicon.ico?v=2',
      apple: '/favicon.ico?v=2'
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bulgarian rose",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <CountdownGuard>
            {children}
          </CountdownGuard>
        </LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'