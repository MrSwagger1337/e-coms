import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import type { Product } from "./interfaces";

export type CategoryData = {
  title: string;
  data: Product[];
};

export async function getProductsByCategory(
  productCategory: string
): Promise<CategoryData> {
  // Fetch dynamic categories from DB
  const dbCategories = await prisma.categoryInfo.findMany({
    select: { name: true, title: true },
  });

  const categoryMap: Record<string, string> = { all: "All Products" };
  dbCategories.forEach((cat) => {
    categoryMap[cat.name] = cat.title;
  });

  if (!(productCategory in categoryMap)) {
    notFound();
  }

  const whereClause: Prisma.ProductWhereInput = {
    status: "published",
  };

  if (productCategory !== "all") {
    whereClause.category = productCategory;
  }

  const data = await prisma.product.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      name_ar: true,
      images: true,
      price: true,
      description: true,
      description_ar: true,
      category: true,
    },
  });

  return {
    title: categoryMap[productCategory],
    data: data as Product[],
  };
}
