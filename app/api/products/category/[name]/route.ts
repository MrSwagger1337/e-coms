import { NextResponse } from "next/server"
import prisma from "@/app/lib/db"
import { unstable_noStore as noStore } from "next/cache"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request, { params }: { params: { name: string } }) {
  noStore()

  try {
    const categoryName = params.name

    const categories: { [key: string]: string } = {
      all: "All Products",
      cosmetics: "Cosmetics",
      perfume: "Perfumes",
      beauty: "Beauty products",
    }

    if (!(categoryName in categories)) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const whereClause: Prisma.ProductWhereInput = {
      status: "published",
    }

    if (categoryName !== "all") {
      whereClause.category = categoryName as Prisma.EnumCategoryFilter<"Product">
    }

    const products = await prisma.product.findMany({
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

    return NextResponse.json({
      title: categories[categoryName],
      products: products,
    })
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

