import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { prisma } from "@/lib/prisma";

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
  const formattedProduct = {
    ...product,
    skinType: product.skinType.split(","),
    images: product.images.split(","),
  };

  return <ProductDetailClient product={formattedProduct as any} />;
}
