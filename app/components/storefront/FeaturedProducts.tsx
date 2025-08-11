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
        "text-5xl font-extrabold tracking-tight mb-8 relative leading-tight",
        className
      )}
    >
      <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
        {title}{" "}
      </span>
      <span className="relative inline-block group">
        <span className="relative z-10 text-white px-6 py-2 font-black tracking-wider">{sale}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 transform skew-x-12 shadow-lg group-hover:shadow-xl transition-shadow duration-300"></span>
        <span
          className={`absolute ${
            isRtl ? "-right-3 -left-3" : "-left-3 -right-3"
          } h-1/2 bg-gradient-to-r from-pink-600 to-pink-700 top-full shadow-md`}
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
    <section aria-labelledby="featured-products-heading" className="relative">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl" />
      
      <SaleHeading4
        title={dictionary.featured.title}
        sale={dictionary.featured.sale}
        isRtl={isRtl}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProducts.map((item, index) => (
          <div 
            key={item.id} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard data={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

function LoadingRows() {
  return (
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
    </div>
  );
}
