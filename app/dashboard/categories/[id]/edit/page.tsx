import prisma from "@/app/lib/db"
import { notFound } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { EditCategoryForm } from "./EditCategoryForm"

async function getData(categoryId: string) {
    const data = await prisma.categoryInfo.findUnique({
        where: {
            id: categoryId,
        },
    })

    if (!data) {
        return notFound()
    }

    return data
}

export default async function EditCategoryRoute({
    params,
}: {
    params: { id: string }
}) {
    noStore()
    const data = await getData(params.id)
    return <EditCategoryForm data={data} />
}
