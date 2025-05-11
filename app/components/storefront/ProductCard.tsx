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
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { cn } from "@/lib/utils";

interface iAppProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
  };
}

export function ProductCard({ item }: iAppProps) {
  const { dictionary, isRtl } = useLanguage();

  if (!dictionary) return null;

  return (
    <Card className="overflow-hidden">
      <Carousel className="w-full">
        <CarouselContent>
          {item.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Product Image"
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={cn("left-4", isRtl ? "left-auto right-4" : "left-4")}
        />
        <CarouselNext
          className={cn("right-4", isRtl ? "right-auto left-4" : "right-4")}
        />
      </Carousel>

      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            <span>5.0</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </CardHeader>

      <CardFooter className="flex items-center justify-between">
        <span className="text-2xl font-bold">
          {isRtl
            ? `${item.price} ${dictionary.product.price}`
            : `${dictionary.product.price} ${item.price}`}
        </span>
        <Button asChild>
          <Link href={`/product/${item.id}`}>{dictionary.product.buy}</Link>
        </Button>
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
