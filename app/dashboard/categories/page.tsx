import prisma from "@/app/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"

async function getData() {
    const data = await prisma.categoryInfo.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })

    return data
}

export default async function CategoriesRoute() {
    noStore()
    const data = await getData()
    return (
        <>
            <div className="flex items-center justify-end">
                <Button asChild className="flex gap-x-2">
                    <Link href="/dashboard/categories/create">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Category</span>
                    </Link>
                </Button>
            </div>

            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Manage your product categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Title (EN)</TableHead>
                                <TableHead>Title (AR)</TableHead>
                                <TableHead className="text-end">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.imageString ? (
                                            <Image
                                                alt="Category Image"
                                                src={item.imageString}
                                                width={64}
                                                height={64}
                                                className="rounded-lg object-cover h-16 w-16"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                No image
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{item.name}</TableCell>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground" dir="rtl">{item.title_ar || "—"}</TableCell>
                                    <TableCell className="text-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/categories/${item.id}/edit`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/categories/${item.id}/delete`}>Delete</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
