import { PrismaClient } from "@prisma/client";
import { products } from "../data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with initial products...");

  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        skinType: product.skinType.join(","),
        images: product.images.join(","),
        rating: product.rating,
        reviewCount: product.reviewCount,
        stock: product.stock,
        badge: product.badge,
        description: product.description,
        ingredients: product.ingredients,
        howToUse: product.howToUse,
        sellerName: "GlowDifferent Official",
        reviews: {
          create: product.reviews.map((review) => ({
            id: review.id,
            author: review.author,
            rating: review.rating,
            date: review.date,
            comment: review.comment,
            verified: review.verified,
            helpful: review.helpful,
          })),
        },
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
