import prisma from "@/app/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { ProfileForm } from "./ProfileForm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

async function getUserData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    return user
}

async function getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            items: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    })
    return orders
}

function getStatusBadge(status: string) {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; labelAr: string }> = {
        pending: { variant: "outline", label: "Pending", labelAr: "قيد الانتظار" },
        paid: { variant: "default", label: "Paid", labelAr: "مدفوع" },
        shipped: { variant: "secondary", label: "Shipped", labelAr: "تم الشحن" },
        delivered: { variant: "default", label: "Delivered", labelAr: "تم التسليم" },
        cancelled: { variant: "destructive", label: "Cancelled", labelAr: "ملغى" },
        failed: { variant: "destructive", label: "Failed", labelAr: "فشل" },
    }
    const config = variants[status] || { variant: "outline" as const, label: status, labelAr: status }
    return { config }
}

export default async function ProfilePage({ params }: { params: { lang: "en" | "ar" } }) {
    noStore()
    const { getUser } = getKindeServerSession()
    const kindeUser = await getUser()

    if (!kindeUser) {
        redirect(`/${params.lang}`)
    }

    const dict = await getDictionary(params.lang)
    const isRtl = params.lang === "ar"

    const dbUser = await getUserData(kindeUser.id)
    const orders = await getUserOrders(kindeUser.id)

    const userData = {
        firstName: dbUser?.firstName || kindeUser.given_name || "",
        lastName: dbUser?.lastName || kindeUser.family_name || "",
        email: kindeUser.email || "",
        phone: dbUser?.phone || "",
        address: dbUser?.address || "",
        emirate: dbUser?.emirate || "",
        deliveryAddress: dbUser?.deliveryAddress || "",
        deliveryEmirate: dbUser?.deliveryEmirate || "",
    }

    return (
        <div className={`max-w-4xl mx-auto px-4 py-8 ${isRtl ? "rtl" : ""}`}>
            <h1 className="text-3xl font-bold mb-8">
                {isRtl ? "ملفي الشخصي" : "My Profile"}
            </h1>

            <ProfileForm userData={userData} lang={params.lang} />

            {/* Order History */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>{isRtl ? "سجل الطلبات" : "Order History"}</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <p className="text-muted-foreground text-center py-6">
                            {isRtl ? "لا توجد طلبات بعد" : "No orders yet"}
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const { config } = getStatusBadge(order.status)
                                return (
                                    <div key={order.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={config.variant}
                                                    className={
                                                        order.status === "paid" ? "bg-green-100 text-green-800" :
                                                            order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                                                                order.status === "delivered" ? "bg-purple-100 text-purple-800" :
                                                                    order.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""
                                                    }
                                                >
                                                    {isRtl ? config.labelAr : config.label}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Intl.DateTimeFormat(isRtl ? "ar-AE" : "en-AE").format(order.createdAt)}
                                                </span>
                                            </div>
                                            <p className="font-bold text-green-600">
                                                {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(order.amount)}
                                            </p>
                                        </div>

                                        {order.items.length > 0 && (
                                            <div className="space-y-2">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3">
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded object-cover h-10 w-10"
                                                        />
                                                        <span className="text-sm flex-1">{item.name}</span>
                                                        <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                                                        <span className="text-sm font-medium">{item.price} AED</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
