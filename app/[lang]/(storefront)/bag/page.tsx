import { checkOut, delItem, updateCartQuantity } from "@/app/actions";
import { ChceckoutButton, DeleteItem } from "@/app/components/SubmitButtons";
import type { Cart } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { redirect } from "next/navigation";

export default async function BagRoute({
  params,
}: {
  params: { lang: "en" | "ar" };
}) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const dict = await getDictionary(params.lang);
  const isRtl = params.lang === "ar";

  if (!user) {
    redirect(`/${params.lang}`);
  }

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  let totalPrice = 0;

  cart?.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]"
    >
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {dict.cart.title || "Shopping Cart"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!cart || !cart.items || cart.items.length === 0 ? (
            <Card className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-muted/5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="w-12 h-12 text-primary" />
              </div>

              <h2 className="mt-8 text-2xl font-semibold">{dict.cart.empty}</h2>
              <p className="mb-10 mt-3 text-center text-base leading-7 text-muted-foreground max-w-md mx-auto">
                {dict.cart.emptyDescription}
              </p>

              <Button size="lg" asChild className="px-8">
                <Link href={`/${params.lang}`}>{dict.cart.shopNow}</Link>
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cart?.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-4 hover:bg-accent/5 transition-colors">
                        {/* Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            className="object-cover"
                            fill
                            src={item.imageString || "/placeholder.svg"}
                            alt={item.name}
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Intl.NumberFormat(isRtl ? "ar-AE" : "en-AE", {
                              style: "currency",
                              currency: "AED",
                            }).format(item.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <form action={updateCartQuantity}>
                            <input type="hidden" name="productId" value={item.id} />
                            <input type="hidden" name="action" value="decrement" />
                            <button
                              type="submit"
                              className="h-8 w-8 rounded-md border flex items-center justify-center hover:bg-accent transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </form>

                          <span className="w-8 text-center font-medium text-sm">
                            {item.quantity}
                          </span>

                          <form action={updateCartQuantity}>
                            <input type="hidden" name="productId" value={item.id} />
                            <input type="hidden" name="action" value="increment" />
                            <button
                              type="submit"
                              className="h-8 w-8 rounded-md border flex items-center justify-center hover:bg-accent transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </form>
                        </div>

                        {/* Item Total */}
                        <div className="text-end min-w-[80px]">
                          <p className="font-bold text-sm sm:text-base">
                            {new Intl.NumberFormat(isRtl ? "ar-AE" : "en-AE", {
                              style: "currency",
                              currency: "AED",
                            }).format(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Delete */}
                        <form action={delItem}>
                          <input type="hidden" name="productId" value={item.id} />
                          <DeleteItem />
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between font-medium text-lg mb-4">
                    <p>{dict.cart.subtotal}</p>
                    <p className="font-bold">
                      {new Intl.NumberFormat(isRtl ? "ar-AE" : "en-AE", {
                        style: "currency",
                        currency: "AED",
                      }).format(totalPrice)}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  {totalPrice < 2 && (
                    <div className="p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                      {isRtl ? "الحد الأدنى للطلب هو 2 درهم للمحاسبة" : "Minimum order amount is 2 AED to checkout"}
                    </div>
                  )}
                  <form action={checkOut}>
                    <ChceckoutButton disabled={totalPrice < 2} />
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
