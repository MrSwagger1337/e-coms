import { NextResponse } from "next/server"
import prisma from "@/app/lib/db"
import { unstable_noStore as noStore } from "next/cache"

export async function GET() {
    noStore()

    try {
        const categories = await prisma.categoryInfo.findMany({
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                name: true,
                title: true,
                title_ar: true,
                imageString: true,
            },
        })

        return NextResponse.json(categories)
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json([], { status: 500 })
    }
}
