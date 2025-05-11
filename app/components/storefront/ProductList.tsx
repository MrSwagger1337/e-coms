"use client";

import { useState } from "react";
import { ProductCard } from "@/app/components/storefront/ProductCard";
import { ProductFilter } from "@/app/components/storefront/ProductFilter";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/app/lib/interfaces";
import { useLanguage } from "@/app/context/LanguageContext";

export function ProductList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const { dictionary, isRtl } = useLanguage();

  if (!dictionary) return null;

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

  return (
    <>
      <ProductFilter
        categories={categories}
        onFilterChange={handleFilterChange}
      />
      <AnimatePresence>
        <motion.div
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
              <ProductCard data={item} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
