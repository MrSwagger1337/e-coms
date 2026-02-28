"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/app/[lang]/(storefront)/components/ProductCard";
import { ProductFilter } from "@/app/[lang]/(storefront)/components/ProductFilter";
import { motion, AnimatePresence } from "framer-motion";
import { PackageX } from "lucide-react";
import type { Product } from "@/app/lib/interfaces";
import { getDictionary, type Dictionary } from "@/app/[lang]/dictionaries";

export function ProductList({
  initialProducts,
  lang,
}: {
  initialProducts: Product[];
  lang: "en" | "ar";
}) {
  const [products] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const isRtl = lang === "ar";

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    loadDictionary();
  }, [lang]);

  const categories = [
    "all",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const handleFilterChange = (category: string) => {
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    }
  };

  if (!dict) return null;

  return (
    <>
      <ProductFilter
        categories={categories}
        onFilterChange={handleFilterChange}
        lang={lang}
        dict={dict}
      />
      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
              <PackageX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isRtl ? "لم يتم العثور على منتجات" : "No products found"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {isRtl
                ? "لا توجد منتجات متاحة في هذه الفئة حالياً. يرجى التحقق لاحقاً أو استكشاف فئات أخرى."
                : "There are no products available in this category at the moment. Please check back later or explore other categories."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard item={item} lang={lang} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
