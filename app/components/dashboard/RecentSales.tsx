import prisma from "@/app/lib/db"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getData() {
  const data = await prisma.order.findMany({
    where: {
      status: {
        in: ["paid", "shipped", "delivered"],
      },
    },
    select: {
      amount: true,
      id: true,
      User: {
        select: {
          firstName: true,
          profileImage: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  })

  return data
}

export async function RecentSales() {
  const data = await getData()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No completed sales yet</p>
        )}
        {data.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <Avatar className="hidden sm:flex h-9 w-9">
              <AvatarImage src={item.User?.profileImage || ""} alt="Avatar Image" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {item.User?.firstName
                  ? item.User.firstName.slice(0, 2).toUpperCase()
                  : "??"}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">{item.User?.firstName || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">{item.User?.email || "No email"}</p>
            </div>
            <p className="ml-auto font-medium">
              +{new Intl.NumberFormat("en-AE", {
                style: "currency",
                currency: "AED",
              }).format(item.amount)}
            </p>

          </div>
        ))}
      </CardContent>
    </Card>
  )
}
