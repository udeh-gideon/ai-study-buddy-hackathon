import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { notes } = await req.json();

    if (!notes || notes.trim() === "") {
      return jsonResponse({ error: "Notes are required" }, 400);
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

    const response = await fetch(OR_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // ✅ stable + free model
        messages: [
          {
            role: "system",
            content:
              "You are a flashcard generator. Generate 5 concise question-answer flashcards from provided notes. Respond strictly in JSON format like this:\n\n[\n{\"question\": \"Q1\", \"answer\": \"A1\"},\n{\"question\": \"Q2\", \"answer\": \"A2\"},\n{\"question\": \"Q3\", \"answer\": \"A3\"},\n{\"question\": \"Q4\", \"answer\": \"A4\"},\n{\"question\": \"Q5\", \"answer\": \"A5\"}\n]",
          },
          {
            role: "user",
            content: `Notes:\n${notes}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter Error:", errText);
      return jsonResponse(
        { error: "OpenRouter API failed", details: errText },
        500,
      );
    }

    const data = await response.json();

    // Extract content
    const flashcardsText = data.choices?.[0]?.message?.content || "[]";

    let flashcards;
    try {
      flashcards = JSON.parse(flashcardsText);
    } catch {
      console.error("Parse Error: Model did not return valid JSON");
      return jsonResponse(
        { error: "Invalid JSON returned from model", raw: flashcardsText },
        500,
      );
    }

    return jsonResponse({ flashcards }, 200);
  } catch (err) {
    console.error("Server Error:", err);
    return jsonResponse(
      { error: "Internal Server Error", details: err.message },
      500,
    );
  }
});
