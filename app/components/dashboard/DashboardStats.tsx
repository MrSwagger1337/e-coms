import prisma from "@/app/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, PartyPopper, ShoppingBag, User2, Clock, TruckIcon } from "lucide-react"

async function getData() {
  const [user, products, order] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
      },
    }),

    prisma.product.findMany({
      select: {
        id: true,
      },
    }),

    prisma.order.findMany({
      select: {
        amount: true,
        status: true,
      },
    }),
  ])

  return {
    user,
    products,
    order,
  }
}

export async function DashboardStats() {
  const { products, user, order } = await getData()

  const paidStatuses = ["paid", "shipped", "delivered"]
  const paidOrders = order.filter((o) => paidStatuses.includes(o.status))
  const pendingOrders = order.filter((o) => o.status === "pending")

  const totalAmount = paidOrders.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat("en-AE", {
              style: "currency",
              currency: "AED",
            }).format(totalAmount)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            From {paidOrders.length} completed {paidOrders.length === 1 ? "order" : "orders"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
          <ShoppingBag className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{paidOrders.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {pendingOrders.length > 0 ? (
              <span className="text-yellow-600">{pendingOrders.length} pending</span>
            ) : (
              "No pending orders"
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <PartyPopper className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{products.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Products in store</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <User2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{user.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Registered users</p>
        </CardContent>
      </Card>
    </div>
  )
}
