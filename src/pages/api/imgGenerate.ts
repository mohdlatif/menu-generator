export const prerender = false;
import type { APIRoute } from "astro";
import Together from "together-ai";

const together = new Together({ apiKey: import.meta.env.TOGETHER_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "No item name provided" }), {
        status: 400,
      });
    }

    const response = await together.images.create({
      prompt: `Professional food photography, restaurant menu style, appetizing ${name} on an elegant plate, soft natural lighting, shallow depth of field, garnished beautifully${
        description ? `, featuring ${description}` : ""
      }, 8k, high-end culinary presentation`,
      model: "black-forest-labs/FLUX.1-schnell",
      width: 1024,
      height: 768,
      steps: 5,
      response_format: "base64",
    });

    return new Response(JSON.stringify({ image: response.data[0] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      status: 500,
    });
  }
};
