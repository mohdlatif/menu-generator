export const prerender = false;
import type { APIRoute } from "astro";
import Together from "together-ai";

const together = new Together({ apiKey: import.meta.env.TOGETHER_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { text } = await request.json();

    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable food expert. When given a menu item, provide a brief but engaging description in the same language as the input. Include: \n- A few appetizing sentences about the dish\n- Key ingredients or preparation method\n- Any notable cultural significance or origin\n- Special dietary notes if relevant (vegetarian, spicy, etc.)\nKeep the tone warm and inviting, suitable for a restaurant menu.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      model: "google/gemma-2b-it",
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<eos>", "<end_of_turn>"],
    });

    const result = response.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing text:", error);
    return new Response(JSON.stringify({ error: "Failed to process text" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
