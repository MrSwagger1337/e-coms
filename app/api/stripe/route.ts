import prisma from "@/app/lib/db"
import { stripe } from "@/app/lib/stripe"
import { headers } from "next/headers"

export async function POST(req: Request) {
  const body = await req.text()

  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_SECRET_WEBHOOK as string)
  } catch (error: unknown) {
    return new Response("Webhook Error", { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "paid" },
        })
      }
      break
    }

    case "checkout.session.expired": {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "cancelled" },
        })
      }
      break
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "failed" },
        })
      }
      break
    }

    default: {
      console.log("unhandled event:", event.type)
    }
  }

  return new Response(null, { status: 200 })
}
