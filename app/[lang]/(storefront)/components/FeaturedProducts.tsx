import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import prisma from "@/app/lib/db";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  description: string;
  description_ar: string | null;
  images: string[];
  price: number;
}

async function getFeaturedProducts(): Promise<Product[]> {
  noStore();
  return await prisma.product.findMany({
    where: {
      status: "published",
      isFeatured: true,
    },
    select: {
      id: true,
      name: true,
      name_ar: true,
      description: true,
      description_ar: true,
      images: true,
      price: true,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

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
      dir={isRtl ? "rtl" : "ltr"}
    >
      {title}{" "}
      <span className="relative inline-block">
        <span className="relative z-10 text-white px-4 py-1">{sale}</span>
        <span className="absolute inset-0 bg-pink-500 transform skew-x-12" />
        <span
          className={cn(
            "absolute h-1/2 bg-pink-600 top-full",
            isRtl ? "-right-2 -left-2" : "-left-2 -right-2"
          )}
        />
      </span>
    </h2>
  );
}

async function FeaturedProductsContent({ lang }: { lang: "en" | "ar" }) {
  const data = await getFeaturedProducts();
  const dict = await getDictionary(lang);
  const isRtl = lang === "ar";

  if (data.length === 0) return null;

  return (
    <>
      <SaleHeading4
        title={dict.featured.title}
        sale={dict.featured.sale}
        isRtl={isRtl}
      />

      <div
        className={cn(
          "grid gap-5",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          isRtl ? "rtl" : "ltr"
        )}
      >
        {data.map((item) => {
          // choose localized fields
          const displayName = isRtl && item.name_ar ? item.name_ar : item.name;
          const displayDescription =
            isRtl && item.description_ar
              ? item.description_ar
              : item.description;
          // reverse images for RTL so UI flows correctly
          const displayImages = isRtl
            ? [...item.images].reverse()
            : item.images;

          return (
            <ProductCard
              key={item.id}
              item={{
                id: item.id,
                name: displayName,
                description: displayDescription,
                images: displayImages,
                price: item.price,
              }}
              lang={lang}
            />
          );
        })}
      </div>
    </>
  );
}

export function FeaturedProducts({ lang }: { lang: "en" | "ar" }) {
  return (
    <section aria-labelledby="featured-products-heading">
      <Suspense fallback={<LoadingRows />}>
        <FeaturedProductsContent lang={lang} />
      </Suspense>
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
