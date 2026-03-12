import prisma from "@/app/lib/db"
import { deleteCategory } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { SubmitButton } from "@/app/components/SubmitButtons"
import { DeleteCategoryForm } from "./DeleteCategoryForm"

async function getData(categoryId: string) {
    const data = await prisma.categoryInfo.findUnique({
        where: { id: categoryId },
    })

    if (!data) {
        return notFound()
    }

    // Check product count
    const productCount = await prisma.product.count({
        where: { category: data.name },
    })

    return { ...data, productCount }
}

export default async function DeleteCategoryRoute({
    params,
}: {
    params: { id: string }
}) {
    noStore()
    const data = await getData(params.id)

    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Are you absolutely sure?</CardTitle>
                    <CardDescription>
                        This action cannot be undone. This will permanently delete the
                        category <strong>&quot;{data.title}&quot;</strong> (slug: {data.name}).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {data.productCount > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            <strong>Warning:</strong> {data.productCount} product(s) currently use this category.
                            You must reassign them to another category before deleting.
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <Button variant="secondary" asChild>
                        <Link href="/dashboard/categories">Cancel</Link>
                    </Button>

                    <DeleteCategoryForm categoryId={data.id} hasProducts={data.productCount > 0} />
                </CardFooter>
            </Card>
        </div>
    )
}
