"use client";

import { addItem } from "@/app/actions";
import { ShoppingBagButton } from "@/app/components/SubmitButtons";
import { FeaturedProducts } from "@/app/components/storefront/FeaturedProducts";
import { ImageSlider } from "@/app/components/storefront/ImageSlider";
import { useLanguage } from "@/app/context/LanguageContext";
import { StarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

export default function ProductIdRoute() {
  const { dictionary, isRtl } = useLanguage();
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (!dictionary || loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-[55vh]">
        Loading...
      </div>
    );
  }

  const addProducttoShoppingCart = addItem.bind(null, product.id);

  return (
    <div
      className={`max-w-7xl mx-auto bg-white/80 border border-t-gray-200 mt-10 p-5 ${
        isRtl ? "rtl" : ""
      }`}
    >
      <div className="grid grid-cols-1 max-w-7xl mx-auto md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
        <ImageSlider images={product.images} />
        <div className="max-w-lg">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <p className="text-3xl mt-2 text-gray-900">
            {isRtl
              ? `${product.price} ${dictionary.product.price}`
              : `${dictionary.product.price}${product.price}`}
          </p>
          <div
            className={`mt-3 flex items-center gap-1 ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-base text-gray-700 mt-6">{product.description}</p>

          <form action={addProducttoShoppingCart}>
            <ShoppingBagButton />
          </form>
        </div>
      </div>

      <div className="mt-16">
        <FeaturedProducts />
      </div>
    </div>
  );
}
