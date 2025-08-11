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
import type { Product } from "@/app/lib/interfaces";
import { addItem } from "@/app/actions";

interface ProductCardProps {
  data: Product;
}

export function ProductCard({ data }: ProductCardProps) {
  const { dictionary, isRtl } = useLanguage();

  if (!dictionary) return null;

  const addProducttoShoppingCart = addItem.bind(null, data.id);

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
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
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Carousel>
          <form action={addProducttoShoppingCart}>
            <Button
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 bg-primary/90 backdrop-blur-sm"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${data.id}`} className="group/title">
            <h3 className="font-semibold text-lg leading-tight group-hover/title:text-primary transition-colors duration-200">
              {isRtl && data.name_ar ? data.name_ar : data.name}
            </h3>
          </Link>
          <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-primary/20">
            {data.category}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {isRtl && data.description_ar
            ? data.description_ar
            : data.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-xl text-primary">
            {isRtl
              ? `${data.price} ${dictionary.product.price}`
              : `${dictionary.product.price}${data.price}`}
          </p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
          </div>
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
