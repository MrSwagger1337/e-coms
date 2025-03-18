import { checkOut, delItem } from "@/app/actions";
import { ChceckoutButton, DeleteItem } from "@/app/components/SubmitButtons";
import type { Cart } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import { Button } from "@/components/ui/button";
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
      className={`max-w-2xl mx-auto mt-10 min-h-[55vh] ${isRtl ? "rtl" : ""}`}
    >
      {!cart || !cart.items ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold">{dict.cart.empty}</h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            {dict.cart.emptyDescription}
          </p>

          <Button asChild>
            <Link href={`/${params.lang}`}>{dict.cart.shopNow}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-10">
          {cart?.items.map((item) => (
            <div
              key={item.id}
              className={`flex ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                <Image
                  className="rounded-md object-cover"
                  fill
                  src={item.imageString || "/placeholder.svg"}
                  alt="Product image"
                />
              </div>
              <div
                className={`${
                  isRtl ? "mr-5" : "ml-5"
                } flex justify-between w-full font-medium`}
              >
                <p>{item.name}</p>
                <div
                  className={`flex flex-col h-full justify-between ${
                    isRtl ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`flex items-center gap-x-2 ${
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

                  <form
                    action={delItem}
                    className={isRtl ? "text-start" : "text-end"}
                  >
                    <input type="hidden" name="productId" value={item.id} />
                    <DeleteItem />
                  </form>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <div
              className={`flex items-center justify-between font-medium ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <p>{dict.cart.subtotal}</p>
              <p>
                {isRtl
                  ? `${new Intl.NumberFormat("en-US").format(totalPrice)} ${
                      dict.product.price
                    }`
                  : `${dict.product.price}${new Intl.NumberFormat(
                      "en-US"
                    ).format(totalPrice)}`}
              </p>
            </div>

            <form action={checkOut}>
              <ChceckoutButton />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
