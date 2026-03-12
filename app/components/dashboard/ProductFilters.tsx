"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/app/hooks/useDebounce"

export function ProductFilters({ categories }: { categories: { id: string, name: string, title: string }[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initialSearch = searchParams.get("search") || ""
    const initialCategory = searchParams.get("category") || "all"

    const [search, setSearch] = useState(initialSearch)
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (debouncedSearch) {
            params.set("search", debouncedSearch)
        } else {
            params.delete("search")
        }

        params.set("page", "1") // reset to first page on search

        router.push(`?${params.toString()}`)
    }, [debouncedSearch, router, searchParams])

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams)

        if (value && value !== "all") {
            params.set("category", value)
        } else {
            params.delete("category")
        }

        params.set("page", "1") // reset to first page on filter

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
            </div>
            <div className="w-full sm:w-[200px]">
                <Select defaultValue={initialCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
