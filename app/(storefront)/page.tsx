"use client";

import { CategoriesSelection } from "../components/storefront/CategorySelection";
import { FeaturedProducts } from "../components/storefront/FeaturedProducts";
import { LandingHeader } from "../components/storefront/LandingHeader";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function IndexPage() {
  const { isRtl } = useLanguage();

  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-8", isRtl ? "rtl" : "")}>
      <LandingHeader />

      <Card className="max-w-screen-2xl mx-auto hidden md:block my-12 overflow-hidden">
        <img
          src="./hero_banner.png"
          alt="Hero Banner"
          className="w-full h-auto object-cover"
        />
      </Card>

      <div className="space-y-16">
        <FeaturedProducts />
        <CategoriesSelection />
      </div>
    </div>
  );
}
