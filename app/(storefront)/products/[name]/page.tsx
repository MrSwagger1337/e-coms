import { ProductCard } from "@/app/components/storefront/ProductCard";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import styles from "./categories.module.css";

async function getData(productCategory: string) {
  switch (productCategory) {
    case "all": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: "published",
        },
      });

      return {
        title: "All Products",
        data: data,
      };
    }
    case "cosmetics": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "cosmetics",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Cosmetics",
        data: data,
      };
    }
    case "perfume": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "perfume",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Perfumes",
        data: data,
      };
    }
    case "beauty": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "beauty",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Beauty products",
        data: data,
      };
    }
    default: {
      return notFound();
    }
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  noStore();
  const { data, title } = await getData(params.name);
  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="my-5 py-10 px-5 border-b border-gray-900/10">
        <span className={`font-semibold text-3xl ${styles.textOutline}`}>
          {title}
        </span>
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}
