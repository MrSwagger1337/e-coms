import prisma from "@/app/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json()

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "cancelled" },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to cancel order:", error)
        return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
    }
}
