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
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", isRtl ? "rtl" : "")}>


      <div className="space-y-24">
        <FeaturedProducts />
        <CategoriesSelection />
      </div>
    </div>
  );
}
