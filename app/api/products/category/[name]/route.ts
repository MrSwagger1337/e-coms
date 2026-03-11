import { NextResponse } from "next/server"
import prisma from "@/app/lib/db"
import { unstable_noStore as noStore } from "next/cache"

export async function GET(request: Request, { params }: { params: { name: string } }) {
  noStore()

  try {
    const categoryName = params.name

    // Fetch dynamic categories from DB
    const dbCategories = await prisma.categoryInfo.findMany({
      select: { name: true, title: true },
    })

    const categoryMap: Record<string, string> = { all: "All Products" }
    dbCategories.forEach((cat) => {
      categoryMap[cat.name] = cat.title
    })

    if (!(categoryName in categoryMap)) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const whereClause: any = {
      status: "published",
    }

    if (categoryName !== "all") {
      whereClause.category = categoryName
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
      title: categoryMap[categoryName],
      products: products,
    })
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
