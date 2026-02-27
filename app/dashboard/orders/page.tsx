import prisma from "@/app/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { unstable_noStore as noStore } from "next/cache"
import { OrderActions } from "@/app/components/dashboard/OrderActions"

async function getData() {
  const data = await prisma.order.findMany({
    select: {
      amount: true,
      createdAt: true,
      status: true,
      id: true,
      User: {
        select: {
          firstName: true,
          email: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return data
}

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pending: { variant: "outline", label: "Pending" },
    paid: { variant: "default", label: "Paid" },
    shipped: { variant: "secondary", label: "Shipped" },
    delivered: { variant: "default", label: "Delivered" },
    cancelled: { variant: "destructive", label: "Cancelled" },
    failed: { variant: "destructive", label: "Failed" },
  }

  const config = variants[status] || { variant: "outline" as const, label: status }

  return (
    <Badge
      variant={config.variant}
      className={
        status === "paid"
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : status === "shipped"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
            : status === "delivered"
              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : ""
      }
    >
      {config.label}
    </Badge>
  )
}

export default async function OrdersPage() {
  noStore()
  const data = await getData()
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Manage and track orders from your store</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium">{item.User?.firstName}</p>
                  <p className="hidden md:flex text-sm text-muted-foreground">{item.User?.email}</p>
                </TableCell>
                <TableCell>Order</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{new Intl.DateTimeFormat("en-US").format(item.createdAt)}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-AE", {
                    style: "currency",
                    currency: "AED",
                  }).format(item.amount)}
                </TableCell>
                <TableCell className="text-end">
                  <OrderActions orderId={item.id} currentStatus={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
