import { NextResponse } from "next/server"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redis } from "@/app/lib/redis"
import type { Cart } from "@/app/lib/interfaces"
import { unstable_noStore as noStore } from "next/cache"

export async function GET() {
  noStore()

  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cart: Cart | null = await redis.get(`cart-${user.id}`)

    return NextResponse.json(cart || { userId: user.id, items: [] })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

