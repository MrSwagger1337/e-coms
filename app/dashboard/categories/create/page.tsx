"use client"

import { createCategory } from "@/app/actions"
import { SubmitButton } from "@/app/components/SubmitButtons"
import { UploadDropzone } from "@/app/lib/uplaodthing"
import { categorySchema } from "@/app/lib/zodSchemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useFormState } from "react-dom"

export default function CreateCategoryRoute() {
    const [image, setImage] = useState<string | undefined>(undefined)
    const [lastResult, action] = useFormState(createCategory, undefined)

    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, { schema: categorySchema })
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <div className="flex items-center gap-x-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/categories">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold tracking-tight">New Category</h1>
            </div>

            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Category Details</CardTitle>
                    <CardDescription>Create a new product category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-y-6">
                        <div className="flex flex-col gap-3">
                            <Label>Slug (unique identifier)</Label>
                            <Input
                                name={fields.name.name}
                                key={fields.name.key}
                                defaultValue={fields.name.initialValue}
                                type="text"
                                placeholder="e.g. cosmetics"
                            />
                            <p className="text-xs text-muted-foreground">
                                This is used in URLs and must be unique. Use lowercase letters, no spaces.
                            </p>
                            <p className="text-red-500">{fields.name.errors}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Display Title (English)</Label>
                            <Input
                                name={fields.title.name}
                                key={fields.title.key}
                                defaultValue={fields.title.initialValue}
                                type="text"
                                placeholder="e.g. Cosmetics"
                            />
                            <p className="text-red-500">{fields.title.errors}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Display Title (Arabic)</Label>
                            <Input
                                name={fields.title_ar.name}
                                key={fields.title_ar.key}
                                defaultValue={fields.title_ar.initialValue}
                                type="text"
                                placeholder="e.g. مستحضرات تجميل"
                                dir="rtl"
                            />
                            <p className="text-red-500">{fields.title_ar.errors}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Category Image</Label>
                            <input
                                type="hidden"
                                value={image || ""}
                                key={fields.imageString.key}
                                name={fields.imageString.name}
                                defaultValue={fields.imageString.initialValue}
                            />
                            {image !== undefined ? (
                                <Image
                                    src={image}
                                    alt="Category Image"
                                    width={200}
                                    height={200}
                                    className="w-[200px] h-[200px] object-cover border rounded-lg"
                                />
                            ) : (
                                <UploadDropzone
                                    onClientUploadComplete={(res) => {
                                        setImage(res[0].url)
                                    }}
                                    onUploadError={() => {
                                        alert("Something went wrong")
                                    }}
                                    endpoint="categoryImageRoute"
                                />
                            )}

                            <p className="text-red-500">{fields.imageString.errors}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton text="Create Category" />
                </CardFooter>
            </Card>
        </form>
    )
}
