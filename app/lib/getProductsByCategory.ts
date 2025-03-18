import prisma from "@/app/lib/db"
import { notFound } from "next/navigation"
import type { Prisma } from "@prisma/client"

export type Product = {
  id: string
  name: string
  images: string[]
  price: number
  description: string
  category: string
}

export type CategoryData = {
  title: string
  data: Product[]
}

export async function getProductsByCategory(productCategory: string): Promise<CategoryData> {
  const categories: { [key: string]: string } = {
    all: "All Products",
    cosmetics: "Cosmetics",
    perfume: "Perfumes",
    beauty: "Beauty products",
  }

  if (!(productCategory in categories)) {
    notFound()
  }

  const whereClause: Prisma.ProductWhereInput = {
    status: "published",
  }

  if (productCategory !== "all") {
    whereClause.category = productCategory as Prisma.EnumCategoryFilter<"Product">
  }

  const data = await prisma.product.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      images: true,
      price: true,
      description: true,
      category: true,
    },
  })

  return {
    title: categories[productCategory],
    data: data as Product[],
  }
}

