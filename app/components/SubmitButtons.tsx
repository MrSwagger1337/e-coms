"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useLanguage } from "@/app/context/LanguageContext";

interface buttonProps {
  text: string;
  variant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | null
  | undefined;
}

export function SubmitButton({ text, variant }: buttonProps) {
  const { pending } = useFormStatus();
  const { isRtl } = useLanguage();

  return (
    <>
      {pending ? (
        <Button disabled variant={variant}>
          <Loader2
            className={`${isRtl ? "ml-2" : "mr-2"} h-4 w-4 animate-spin`}
          />
          {isRtl ? "يرجى الانتظار" : "Please Wait"}
        </Button>
      ) : (
        <Button variant={variant} type="submit">
          {text}
        </Button>
      )}
    </>
  );
}

interface ShoppingBagButtonProps {
  text?: string;
  isRtlServer?: boolean;
}

export function ShoppingBagButton({ text, isRtlServer }: ShoppingBagButtonProps) {
  const { pending } = useFormStatus();
  const context = useLanguage();

  // Use server props if provided, otherwise fallback to context
  const isRtl = isRtlServer ?? context.isRtl;
  const buttonText = text || context.dictionary?.product?.addToCart || (isRtl ? "اضافة المنتج الي السلة" : "Add to Cart");

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2
            className={`${isRtl ? "ml-4" : "mr-4"} h-5 w-5 animate-spin`}
          />
          {isRtl ? "يرجى الانتظار" : "Please Wait"}
        </Button>
      ) : (
        <Button size="lg" className="w-full mt-5" type="submit">
          <ShoppingBag className={`${isRtl ? "ml-4" : "mr-4"} h-5 w-5`} />
          {buttonText}
        </Button>
      )}
    </>
  );
}

interface DeleteItemProps {
  text?: string;
  removingText?: string;
}

export function DeleteItem({ text, removingText }: DeleteItemProps) {
  const { pending } = useFormStatus();
  const context = useLanguage();

  const removing = removingText || context.dictionary?.cart?.removing || "Removing...";
  const del = text || context.dictionary?.cart?.delete || "Delete";

  return (
    <>
      {pending ? (
        <button disabled className="font-medium text-primary text-end">
          {removing}
        </button>
      ) : (
        <button type="submit" className="font-medium text-primary text-end">
          {del}
        </button>
      )}
    </>
  );
}

interface CheckoutButtonProps {
  disabled?: boolean;
  text?: string;
  isRtlServer?: boolean;
}

export function ChceckoutButton({ disabled, text, isRtlServer }: CheckoutButtonProps) {
  const { pending } = useFormStatus();
  const context = useLanguage();

  const isRtl = isRtlServer ?? context.isRtl;
  const checkoutText = text || context.dictionary?.cart?.checkout || (isRtl ? "إتمام عمليه الدفع" : "Checkout");

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2
            className={`${isRtl ? "ml-2" : "mr-2"} h-5 w-5 animate-spin`}
          />
          {isRtl ? "يرجى الانتظار" : "Please Wait"}
        </Button>
      ) : (
        <Button type="submit" size="lg" className="w-full mt-5" disabled={disabled}>
          {checkoutText}
        </Button>
      )}
    </>
  );
}
