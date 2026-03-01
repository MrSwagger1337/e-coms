import { MetadataRoute } from 'next';
import prisma from "@/app/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bulgarianrose.ae";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapData: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${SITE_URL}/products/all`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/bag`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ];

    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                createdAt: true,
            }
        });

        const productUrls = products.map((product) => ({
            url: `${SITE_URL}/product/${product.id}`,
            lastModified: product.createdAt,
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }));

        return [...sitemapData, ...productUrls];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return sitemapData;
    }
}
