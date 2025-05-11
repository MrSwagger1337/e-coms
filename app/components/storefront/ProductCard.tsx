"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  data: {
    id: string;
    name: string;
    name_ar?: string;
    price: number;
    description: string;
    description_ar?: string;
    imageString: string;
  };
  isRtl: boolean;
}

export function ProductCard({ data, lang }: ProductCardProps) {
  const { dictionary, isRtl } = useLanguage();
  const dict = dictionary || {};
  const addProducttoShoppingCart = addItem.bind(null, data.id);

  if (!dictionary) return null;

  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {data.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square">
                    <Image
                      fill
                      src={image}
                      alt="Product Image"
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          <form action={addProducttoShoppingCart}>
            <Button
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              {isRtl ? data.name_ar || data.name : data.name}
            </h3>
            <Badge variant="secondary">{data.category}</Badge>
          </div>
          <p className="text-muted-foreground line-clamp-2">
            {isRtl ? data.description_ar || data.description : data.description}
          </p>
          <p className="font-semibold">
            {isRtl
              ? `${data.price} ${dict.product.price}`
              : `${dict.product.price}${data.price}`}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export function LoadingProductCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
