import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc', // Newest first
      }
    });

    // Format the products to match the expected frontend structure
    const formattedProducts = products.map((p) => ({
      ...p,
      skinType: p.skinType.split(","),
      images: p.images.split(","),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real app, you would validate this payload carefully using Zod or Joi
    const {
      name,
      price,
      category,
      skinType, // array of strings
      description,
      ingredients,
      howToUse,
      images, // array of strings
      sellerName,
    } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        skinType: skinType.join(","),
        description,
        ingredients,
        howToUse,
        images: images.join(","),
        sellerName: sellerName || "Independent Seller",
        // Default values for new products
        rating: 0,
        reviewCount: 0,
        stock: 10, 
        badge: "New Drop",
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
