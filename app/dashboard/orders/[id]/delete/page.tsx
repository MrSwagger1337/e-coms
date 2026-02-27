import { deleteOrder } from "@/app/actions"
import { SubmitButton } from "@/app/components/SubmitButtons"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DeleteOrderRoute({ params }: { params: { id: string } }) {
    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Are you absolutely sure?</CardTitle>
                    <CardDescription>
                        This action cannot be undone. This will permanently delete this order and remove all data from our
                        servers.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="w-full flex justify-between">
                    <Button variant="secondary" asChild>
                        <Link href="/dashboard/orders">Cancel</Link>
                    </Button>
                    <form action={deleteOrder}>
                        <input type="hidden" name="orderId" value={params.id} />
                        <SubmitButton variant="destructive" text="Delete Order" />
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
