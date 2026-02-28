import prisma from "@/app/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"
import { Search } from "lucide-react"

async function getUsers(search?: string) {
    const where = search
        ? {
            OR: [
                { firstName: { contains: search, mode: "insensitive" as const } },
                { lastName: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { phone: { contains: search, mode: "insensitive" as const } },
                { orders: { some: { id: { equals: search } } } },
            ],
        }
        : {}

    const users = await prisma.user.findMany({
        where,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            emirate: true,
            createdAt: true,
            _count: {
                select: { orders: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    })

    return users
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: { q?: string }
}) {
    noStore()
    const users = await getUsers(searchParams.q)

    return (
        <Card>
            <CardHeader className="px-7">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            All registered users ({users.length})
                        </CardDescription>
                    </div>
                </div>

                <form className="mt-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="q"
                            placeholder="Search by name, email, phone, or order ID..."
                            defaultValue={searchParams.q || ""}
                            className="pl-9"
                        />
                    </div>
                </form>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Emirate</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    {searchParams.q ? "No users found matching your search" : "No users yet"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/users/${user.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {user.firstName} {user.lastName}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-sm">{user.email}</TableCell>
                                    <TableCell className="text-sm" dir="ltr">{user.phone || "—"}</TableCell>
                                    <TableCell className="text-sm">{user.emirate || "—"}</TableCell>
                                    <TableCell className="text-sm">{user._count.orders}</TableCell>
                                    <TableCell className="text-sm">
                                        {new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(user.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
