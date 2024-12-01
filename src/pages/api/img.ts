export const prerender = false;
import type { APIRoute } from "astro";
import { Readable } from "stream";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the buffer from request body
    const buffer = await request.arrayBuffer();

    // Get the content type from headers
    const contentType = request.headers.get("Content-Type");

    if (
      !contentType ||
      !["image/png", "image/jpeg", "image/jpg"].includes(contentType)
    ) {
      return new Response(JSON.stringify({ error: "Invalid image type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Image captured successfully",
        size: buffer.byteLength,
        type: contentType,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response(JSON.stringify({ error: "Failed to process image" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
