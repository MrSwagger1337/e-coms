"use client";

import { checkOut, delItem } from "@/app/actions";
import { ChceckoutButton, DeleteItem } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { useEffect, useState } from "react";
import type { Cart } from "@/app/lib/interfaces";

export default function BagRoute() {
  const { dictionary, isRtl } = useLanguage();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCart(data);

        let total = 0;
        data?.items?.forEach((item: any) => {
          total += item.price * item.quantity;
        });
        setTotalPrice(total);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (!dictionary || loading) {
    return (
      <div className="flex justify-center items-center min-h-[55vh]">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`max-w-2xl mx-auto mt-10 min-h-[55vh] ${isRtl ? "rtl" : ""}`}
    >
      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            {dictionary.cart.empty}
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            {dictionary.cart.emptyDescription}
          </p>

          <Button asChild>
            <Link href="/">{dictionary.cart.shopNow}</Link>
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
                className={`${isRtl ? "mr-5" : "ml-5"
                  } flex justify-between w-full font-medium`}
              >
                <p>{item.name}</p>
                <div
                  className={`flex flex-col h-full justify-between ${isRtl ? "items-start" : "items-end"
                    }`}
                >
                  <div
                    className={`flex items-center gap-x-2 ${isRtl ? "flex-row-reverse" : ""
                      }`}
                  >
                    <p>{item.quantity} x</p>
                    <p>
                      {isRtl
                        ? `${item.price} ${dictionary.product.price}`
                        : `${dictionary.product.price}${item.price}`}
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
              className={`flex items-center justify-between font-medium ${isRtl ? "flex-row-reverse" : ""
                }`}
            >
              <p>{dictionary.cart.subtotal}</p>
              <p>
                {isRtl
                  ? `${new Intl.NumberFormat("ar-AE", {
                    style: "currency",
                    currency: "AED"
                  }).format(totalPrice)} ${dictionary.product.price}`
                  : `${dictionary.product.price}${new Intl.NumberFormat("en-AE", {
                    style: "currency",
                    currency: "AED"
                  }).format(totalPrice)}`}
              </p>

            </div>

            {totalPrice < 2 && (
              <div className={`p-3 mt-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium ${isRtl ? "text-right" : "text-left"}`}>
                {isRtl ? "الحد الأدنى للطلب هو 2 درهم للمحاسبة" : "Minimum order amount is 2 AED to checkout"}
              </div>
            )}

            <form action={checkOut}>
              <ChceckoutButton disabled={totalPrice < 2} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
