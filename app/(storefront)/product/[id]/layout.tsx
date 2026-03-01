import type { Metadata } from 'next';
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bulgarianrose.ae";

interface Props {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const cookieStore = cookies();
    const language = cookieStore.get("language")?.value || "en";
    const isAr = language === "ar";

    const product = await prisma.product.findUnique({
        where: {
            id: params.id,
        },
        select: {
            name: true,
            name_ar: true,
            description: true,
            description_ar: true,
            images: true,
            price: true,
        }
    });

    if (!product) {
        return {
            title: isAr ? "المنتج غير موجود" : "Product Not Found",
        };
    }

    const productName = isAr && product.name_ar ? product.name_ar : product.name;
    const productDescription = isAr && product.description_ar ? product.description_ar : product.description;

    return {
        title: productName,
        description: productDescription,
        openGraph: {
            title: productName,
            description: productDescription,
            images: product.images.map(image => ({
                url: image,
                width: 800,
                height: 800,
                alt: productName,
            })),
            url: `${SITE_URL}/product/${params.id}`,
            type: "website", // Or "article" depending on the strictness of OG
        },
        twitter: {
            card: "summary_large_image",
            title: productName,
            description: productDescription,
            images: product.images,
        }
    };
}

export default async function ProductLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const cookieStore = cookies();
    const language = cookieStore.get("language")?.value || "en";
    const isAr = language === "ar";

    const product = await prisma.product.findUnique({
        where: {
            id: params.id,
        },
        select: {
            name: true,
            name_ar: true,
            description: true,
            description_ar: true,
            images: true,
            price: true,
        }
    });

    if (!product) {
        notFound();
    }

    const productName = isAr && product.name_ar ? product.name_ar : product.name;
    const productDescription = isAr && product.description_ar ? product.description_ar : product.description;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productName,
        image: product.images,
        description: productDescription,
        offers: {
            "@type": "Offer",
            url: `${SITE_URL}/product/${params.id}`,
            priceCurrency: "AED",
            price: product.price,
            availability: "https://schema.org/InStock",
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            itemCondition: "https://schema.org/NewCondition",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
