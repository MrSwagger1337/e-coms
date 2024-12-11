import { Suspense } from "react";
import {
  getProductsByCategory,
  Product,
} from "@/app/lib/getProductsByCategory";
// import { ProductCard } from "@/app/components/storefront/ProductCard";
// import { ProductFilter } from "@/app/components/storefront/ProductFilter";
import { AnimatedHeading } from "@/app/components/storefront/AnimatedHeading";
import { ProductList } from "@/app/components/storefront/ProductList";

export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  const { data, title } = await getProductsByCategory(params.name);

  return (
    <section className="max-w-7xl mx-auto min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedHeading title={title} />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList initialProducts={data} />
      </Suspense>
    </section>
  );
}
