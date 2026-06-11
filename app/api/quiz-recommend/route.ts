import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skinType, concerns, preferredTypes, budget } = body;

    if (!skinType || !Array.isArray(concerns) || !Array.isArray(preferredTypes) || !budget) {
      return NextResponse.json({ error: "Missing quiz answers" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const productContext = products
      .map(
        (product) =>
          `- id: ${product.id}, name: ${product.name}, category: ${product.category}, price: $${product.price}, skinType: ${product.skinType.join(", ")}, badge: ${product.badge ?? "None"}`
      )
      .join("\n");

    const prompt = `You are a skincare expert AI. Based on the user's skin profile, recommend exactly 4 products from the given product list. Return ONLY a JSON array of product IDs.

User profile:
- skinType: ${skinType}
- concerns: ${concerns.join(", ")}
- preferredTypes: ${preferredTypes.join(", ")}
- budget: ${budget}

Product list:
${productContext}

Return exactly one JSON array like ["1","6","12","20"]. Do not return any other text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const recommendedIds = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(recommendedIds)) {
      throw new Error("Invalid IDs response");
    }

    return NextResponse.json({ recommendedIds });
  } catch (error) {
    console.error("Quiz recommend API error:", error);
    const fallbackIds = products.filter((p) => p.badge === "Bestseller").slice(0, 4).map((p) => p.id);
    return NextResponse.json({ recommendedIds: fallbackIds });
  }
}
