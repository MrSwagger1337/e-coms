"use client"

import { deleteCategory } from "@/app/actions"
import { SubmitButton } from "@/app/components/SubmitButtons"
import { Button } from "@/components/ui/button"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { toast } from "sonner"

interface State {
    error?: string;
}

export function DeleteCategoryForm({ categoryId, hasProducts }: { categoryId: string, hasProducts: boolean }) {
    const [state, formAction] = useFormState<State, FormData>(deleteCategory, {})

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    if (hasProducts) {
        return (
            <Button variant="destructive" disabled>
                Cannot Delete (Has Products)
            </Button>
        )
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="categoryId" value={categoryId} />
            <SubmitButton text="Delete Category" variant="destructive" />
            {state?.error && (
                <p className="text-red-500 text-sm mt-2 text-right">{state.error}</p>
            )}
        </form>
    )
}
