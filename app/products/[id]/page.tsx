import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { prisma } from "@/lib/prisma";
import type { Product, SkinType, Category, Badge } from "@/data/products";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { reviews: true },
  });

  if (!product) notFound();

  // Format to match expected frontend interface
  const formattedProduct: Product = {
    ...product,
    category: product.category as Category,
    badge: (product.badge || undefined) as Badge | undefined,
    skinType: product.skinType.split(",") as SkinType[],
    images: product.images.split(","),
  };

  return <ProductDetailClient product={formattedProduct} />;
}

