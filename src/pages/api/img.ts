export const prerender = false;
import type { APIRoute } from "astro";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// import { Readable } from "stream";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the buffer and convert to base64
    const buffer = await request.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const prompt = `Analyze this menu image and extract the following information for each menu item:
- Item name
- Price
- Description (if available)
- Category/Section (if available)

Format the response as a JSON array of menu items, where each item follows this structure:
{
  "name": "Item Name",
  "price": "Price as shown",
  "description": "Item description",
  "category": "Menu section/category"
}

Only include items that are clearly visible and readable. Maintain the exact pricing as shown in the image.`;

    const image = {
      inlineData: {
        data: base64Image,
        mimeType: request.headers.get("Content-Type") || "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const response = result.response;
    const text = response.text().trim();

    // Clean up markdown code blocks if present
    const jsonText = text.replace(/```json\n|\n```/g, "").trim();
    const menuItems = JSON.parse(jsonText);

    return new Response(JSON.stringify({ menuItems }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing menu:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process menu image" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
