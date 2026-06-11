import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productName, category } = await request.json();

    if (!productName || !category) {
      return NextResponse.json({ error: "Missing productName or category" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured", recommendations: null },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`You are a beauty & skincare product recommendation engine for a Gen-Z skincare brand called "Glow".

Given this product:
- Name: ${productName}
- Category: ${category}

Recommend exactly 3 complementary beauty/skincare products that a customer might also love. Return ONLY a valid JSON array (no markdown, no explanation) with objects containing these fields:
- name: string (creative product name)
- reason: string (1 sentence, Gen-Z friendly tone)
- price: number (realistic USD price between 14-55)
- category: string (one of: Serums, Moisturizers, SPF, Cleansers, Masks)

Example format:
[{"name":"Product Name","reason":"Why they'd love it","price":32,"category":"Serums"}]`);

    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const recommendations = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
