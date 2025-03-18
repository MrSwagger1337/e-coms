import { NextResponse } from "next/server"
import prisma from "@/app/lib/db"
import { unstable_noStore as noStore } from "next/cache"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  noStore()

  try {
    const productId = params.id

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

