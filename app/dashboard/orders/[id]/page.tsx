import prisma from "@/app/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { unstable_noStore as noStore } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

async function getOrder(id: string) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: true,
            User: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    profileImage: true,
                },
            },
        },
    })
    return order
}

function getStatusBadge(status: string) {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
        pending: { variant: "outline", label: "Pending" },
        paid: { variant: "default", label: "Paid" },
        shipped: { variant: "secondary", label: "Shipped" },
        delivered: { variant: "default", label: "Delivered" },
        cancelled: { variant: "destructive", label: "Cancelled" },
        failed: { variant: "destructive", label: "Failed" },
    }
    return config[status] || { variant: "outline" as const, label: status }
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    noStore()
    const order = await getOrder(params.id)

    if (!order) {
        notFound()
    }

    const statusConfig = getStatusBadge(order.status)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/orders">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Order Info</CardTitle>
                            <Badge
                                variant={statusConfig.variant}
                                className={
                                    order.status === "paid" ? "bg-green-100 text-green-800" :
                                        order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                                            order.status === "delivered" ? "bg-purple-100 text-purple-800" :
                                                order.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""
                                }
                            >
                                {statusConfig.label}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date</span>
                            <span>{new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-bold text-green-600">
                                {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(order.amount)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Name</span>
                            <span>{order.User?.firstName} {order.User?.lastName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span>{order.User?.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Phone</span>
                            <span dir="ltr">{order.phone || order.User?.phone || "—"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Delivery</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Address</span>
                            <span>{order.deliveryAddress || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Emirate</span>
                            <span>{order.deliveryEmirate || "—"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Items ({order.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {order.items.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-4">No item details recorded for this order</p>
                        ) : (
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            width={56}
                                            height={56}
                                            className="rounded-md object-cover h-14 w-14"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">
                                            {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}

                                <div className="border-t pt-3 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-green-600">
                                        {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(order.amount)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
