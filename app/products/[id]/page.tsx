import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductById, products } from "@/data/products";

interface ProductPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
