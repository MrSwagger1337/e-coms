import prisma from "@/app/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { unstable_noStore as noStore } from "next/cache"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getUserWithOrders(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                include: { items: true },
                orderBy: { createdAt: "desc" },
            },
        },
    })
    return user
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

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    noStore()
    const user = await getUserWithOrders(params.id)

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">User Profile</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Personal Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Name</span>
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Phone</span>
                            <span dir="ltr">{user.phone || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Address</span>
                            <span>{user.address || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Emirate</span>
                            <span>{user.emirate || "—"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Delivery Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivery Address</span>
                            <span>{user.deliveryAddress || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivery Emirate</span>
                            <span>{user.deliveryEmirate || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Joined</span>
                            <span>{new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(user.createdAt)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Orders</span>
                            <span className="font-medium">{user.orders.length}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Orders ({user.orders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {user.orders.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">No orders</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.orders.map((order) => {
                                    const sc = getStatusBadge(order.status)
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <Link href={`/dashboard/orders/${order.id}`} className="font-mono text-xs hover:underline">
                                                    {order.id.slice(0, 8)}...
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={sc.variant}
                                                    className={
                                                        order.status === "paid" ? "bg-green-100 text-green-800" :
                                                            order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                                                                order.status === "delivered" ? "bg-purple-100 text-purple-800" :
                                                                    order.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""
                                                    }
                                                >
                                                    {sc.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{order.items.length}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(order.amount)}
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(order.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
