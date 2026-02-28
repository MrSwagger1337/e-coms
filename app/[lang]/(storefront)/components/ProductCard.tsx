"use client"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { useEffect, useState } from "react"

interface iAppProps {
  item: {
    id: string
    name: string
    name_ar?: string
    description: string
    description_ar?: string
    price: number
    images: string[]
  }
  lang: "en" | "ar"
}

export function ProductCard({ item, lang }: iAppProps) {
  const [dict, setDict] = useState<any>(null)
  const isRtl = lang === "ar"

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    loadDictionary()
  }, [lang])

  if (!dict) return null

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {item.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[330px]">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Product Image"
                  fill
                  className="object-cover object-center w-full h-full rounded-t-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`${isRtl ? "mr-16" : "ml-16"}`} />
        <CarouselNext className={`${isRtl ? "ml-16" : "mr-16"}`} />
      </Carousel>
      <div className="px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {isRtl && item.name_ar ? item.name_ar : item.name}
        </h5>
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {/* Placeholder for Ratings */}
            <svg
              className="w-4 h-4 text-yellow-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            {/* Repeat as needed */}
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
            5.0
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {isRtl ? `${item.price} ${dict.product.price}` : `${dict.product.price} ${item.price}`}
          </span>
          <Button asChild>
            <Link
              href={`/${lang}/product/${item.id}`}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {dict.product.buy}
            </Link>
          </Button>
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {isRtl && item.description_ar ? item.description_ar : item.description}
        </p>
      </div>
    </div>
  )
}

export function LoadingProductCard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-[330px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
      </div>
      <Skeleton className="w-full h-10 mt-5" />
    </div>
  )
}

