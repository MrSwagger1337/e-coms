import { NextResponse } from "next/server"
import prisma from "@/app/lib/db"
import { unstable_noStore as noStore } from "next/cache"

export async function GET() {
  noStore()

  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        status: "published",
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        price: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    })

    return NextResponse.json(featuredProducts)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}

