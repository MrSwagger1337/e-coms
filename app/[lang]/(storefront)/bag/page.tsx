import { checkOut, delItem } from "@/app/actions";
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
import { ShoppingBag } from "lucide-react";
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
      className={`max-w-4xl mx-auto px-4 py-12 min-h-[70vh] ${
        isRtl ? "rtl" : ""
      }`}
    >
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {dict.cart.title || "Shopping Cart"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!cart || !cart.items ? (
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
            <div className="flex flex-col gap-y-8">
              <div className="space-y-6">
                {cart?.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div
                        className={`flex items-center p-4 hover:bg-accent/5 transition-colors ${
                          isRtl ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 relative rounded-lg overflow-hidden">
                          <Image
                            className="object-cover"
                            fill
                            src={item.imageString || "/placeholder.svg"}
                            alt="Product image"
                          />
                        </div>
                        <div
                          className={`${
                            isRtl ? "mr-6" : "ml-6"
                          } flex justify-between w-full items-center`}
                        >
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg">
                              {item.name}
                            </h3>
                            <div
                              className={`flex items-center gap-x-2 text-muted-foreground ${
                                isRtl ? "flex-row-reverse" : ""
                              }`}
                            >
                              <p>{item.quantity} x</p>
                              <p>
                                {isRtl
                                  ? `${item.price} ${dict.product.price}`
                                  : `${dict.product.price}${item.price}`}
                              </p>
                            </div>
                          </div>

                          <form
                            action={delItem}
                            className={isRtl ? "text-start" : "text-end"}
                          >
                            <input
                              type="hidden"
                              name="productId"
                              value={item.id}
                            />
                            <DeleteItem />
                          </form>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-6">
                  <div
                    className={`flex items-center justify-between font-medium text-lg mb-6 ${
                      isRtl ? "flex-row-reverse" : ""
                    }`}
                  >
                    <p>{dict.cart.subtotal}</p>
                    <p className="font-bold">
                      {isRtl
                        ? `${new Intl.NumberFormat("en-US").format(
                            totalPrice
                          )} ${dict.product.price}`
                        : `${dict.product.price}${new Intl.NumberFormat(
                            "en-US"
                          ).format(totalPrice)}`}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <form action={checkOut}>
                    <ChceckoutButton />
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
