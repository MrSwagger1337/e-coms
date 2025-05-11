import { addItem } from "@/app/actions";
import { ShoppingBagButton } from "@/app/components/SubmitButtons";
import { FeaturedProducts } from "@/app/[lang]/(storefront)/components/FeaturedProducts";
import { ImageSlider } from "@/app/[lang]/(storefront)/components/ImageSlider";
import prisma from "@/app/lib/db";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData(productId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      price: true,
      images: true,
      description: true,
      description_ar: true,
      name: true,
      name_ar: true,
      id: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function ProductIdRoute({
  params,
}: {
  params: { id: string; lang: "en" | "ar" };
}) {
  noStore();
  const data = await getData(params.id);
  const dict = await getDictionary(params.lang);
  const isRtl = params.lang === "ar";

  const addProducttoShoppingCart = addItem.bind(null, data.id);

  return (
    <div
      className={`max-w-7xl mx-auto bg-white/80 border border-t-gray-200 mt-10 p-5 ${
        isRtl ? "rtl" : ""
      }`}
    >
      <div className="grid grid-cols-1 max-w-7xl mx-auto md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
        <ImageSlider images={data.images} lang={params.lang} />
        <div className="max-w-lg">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {isRtl ? data.name_ar || data.name : data.name}
          </h1>
          <p className="text-3xl mt-2 text-gray-900">
            {isRtl
              ? `${data.price} ${dict.product.price}`
              : `${dict.product.price}${data.price}`}
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
          <p className="text-base text-gray-700 mt-6">
            {isRtl ? data.description_ar || data.description : data.description}
          </p>

          <form action={addProducttoShoppingCart}>
            <ShoppingBagButton />
          </form>
        </div>
      </div>

      <div className="mt-16">
        <FeaturedProducts lang={params.lang} />
      </div>
    </div>
  );
}
