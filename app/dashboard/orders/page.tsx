import prisma from "@/app/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { unstable_noStore as noStore } from "next/cache"
import { OrderActions } from "@/app/components/dashboard/OrderActions"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 15

const STATUSES = ["all", "pending", "paid", "shipped", "delivered", "cancelled", "failed"]

async function getData(page: number, status?: string) {
  const where = status && status !== "all" ? { status } : {}

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      select: {
        amount: true,
        createdAt: true,
        status: true,
        id: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ])

  return { data, total, pages: Math.ceil(total / PAGE_SIZE) }
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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string }
}) {
  noStore()
  const page = Math.max(1, parseInt(searchParams.page || "1"))
  const status = searchParams.status || "all"
  const { data, total, pages } = await getData(page, status)

  function buildUrl(params: Record<string, string>) {
    const sp = new URLSearchParams()
    if (params.status && params.status !== "all") sp.set("status", params.status)
    if (params.page && params.page !== "1") sp.set("page", params.page)
    const qs = sp.toString()
    return `/dashboard/orders${qs ? `?${qs}` : ""}`
  }

  return (
    <Card>
      <CardHeader className="px-7">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              {total} order{total !== 1 ? "s" : ""} total
            </CardDescription>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={buildUrl({ status: s, page: "1" })}
            >
              <Badge
                variant={status === s ? "default" : "outline"}
                className={`cursor-pointer capitalize ${status === s ? "" : "hover:bg-accent"}`}
              >
                {s === "all" ? "All" : s}
              </Badge>
            </Link>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-accent/50">
                  <TableCell>
                    <Link href={`/dashboard/orders/${item.id}`} className="block">
                      <p className="font-medium">{item.User?.firstName} {item.User?.lastName}</p>
                      <p className="hidden md:block text-sm text-muted-foreground">{item.User?.email}</p>
                    </Link>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-sm">
                    {new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short" }).format(item.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                    }).format(item.amount)}
                  </TableCell>
                  <TableCell className="text-end">
                    <OrderActions orderId={item.id} currentStatus={item.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {pages}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={buildUrl({ status, page: String(page - 1) })}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
              {page < pages ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={buildUrl({ status, page: String(page + 1) })}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
