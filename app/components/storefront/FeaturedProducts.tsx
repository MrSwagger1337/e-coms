"use client";

import { useEffect, useState } from "react";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import { useLanguage } from "@/app/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/app/lib/interfaces";

function SaleHeading4({
  className,
  title,
  sale,
  isRtl,
}: {
  className?: string;
  title: string;
  sale: string;
  isRtl: boolean;
}) {
  return (
    <h2
      className={cn(
        "text-4xl font-extrabold tracking-tight mb-5 relative",
        className
      )}
    >
      {title}{" "}
      <span className="relative inline-block">
        <span className="relative z-10 text-white px-4 py-1">{sale}</span>
        <span className="absolute inset-0 bg-pink-500 transform skew-x-12"></span>
        <span
          className={`absolute ${
            isRtl ? "-right-2 -left-2" : "-left-2 -right-2"
          } h-1/2 bg-pink-600 top-full`}
        ></span>
      </span>
    </h2>
  );
}

export function FeaturedProducts() {
  const { dictionary, isRtl } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/featured");
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!dictionary) return null;

  if (loading) {
    return <LoadingRows />;
  }

  if (featuredProducts.length === 0) return null;

  return (
    <section aria-labelledby="featured-products-heading">
      <SaleHeading4
        title={dictionary.featured.title}
        sale={dictionary.featured.sale}
        isRtl={isRtl}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredProducts.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
}

function LoadingRows() {
  return (
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
    </div>
  );
}
