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
import { MoreHorizontal, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"
import { ProductFilters } from "@/app/components/dashboard/ProductFilters"
import { Prisma } from "@prisma/client"

const PAGE_SIZE = 10

async function getProducts(search?: string, category?: string, page: number = 1) {
  const where: Prisma.ProductWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { name_ar: { contains: search, mode: "insensitive" } }
    ]
  }

  if (category && category !== "all") {
    where.category = category
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.product.count({ where })
  ])

  return { products, totalCount, totalPages: Math.ceil(totalCount / PAGE_SIZE) }
}

async function getCategories() {
  return await prisma.categoryInfo.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, title: true }
  })
}

export default async function ProductsRoute({ searchParams }: { searchParams: { search?: string, category?: string, page?: string } }) {
  noStore()

  const search = searchParams.search
  const category = searchParams.category
  const page = parseInt(searchParams.page || "1", 10)

  const [{ products, totalPages, totalCount }, categories] = await Promise.all([
    getProducts(search, category, page),
    getCategories()
  ])

  // Helper map to efficiently display category titles
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.title
    return acc
  }, {} as Record<string, string>)

  // Helper to build pagination links while preserving search/category
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category) params.set("category", category)
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Products Inventory</h1>
        <Button asChild className="flex items-center gap-x-2">
          <Link href="/dashboard/products/create">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </Button>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products and view their details. Showing {products.length} of {totalCount} product(s).</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductFilters categories={categories} />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        alt="Product Image"
                        src={item.images[0]}
                        height={64}
                        width={64}
                        className="rounded-md object-cover h-16 w-16"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {categoryMap[item.category] || item.category}
                      </span>
                    </TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.price} AED</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{new Intl.DateTimeFormat("en-US").format(item.createdAt)}</TableCell>
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
                            <Link href={`/dashboard/products/${item.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/${item.id}/delete`}>Delete</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground hidden sm:block">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  asChild={page > 1}
                >
                  {page > 1 ? (
                    <Link href={createPageURL(page - 1)}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Link>
                  ) : (
                    <span><ChevronLeft className="h-4 w-4 mr-1" /> Previous</span>
                  )}
                </Button>
                <div className="flex font-medium text-sm space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                    // Show a limited number of pages to avoid overcrowding
                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                      return (
                        <Button
                          key={p}
                          variant={p === page ? "default" : "outline"}
                          size="sm"
                          className="w-9 h-9 p-0"
                          asChild={p !== page}
                        >
                          {p !== page ? <Link href={createPageURL(p)}>{p}</Link> : <span>{p}</span>}
                        </Button>
                      )
                    }
                    if (p === page - 2 || p === page + 2) {
                      return <span key={p} className="px-1 py-1">...</span>
                    }
                    return null
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  asChild={page < totalPages}
                >
                  {page < totalPages ? (
                    <Link href={createPageURL(page + 1)}>
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  ) : (
                    <span>Next <ChevronRight className="h-4 w-4 ml-1" /></span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
