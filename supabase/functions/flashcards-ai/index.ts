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
  // Handle preflight requests
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
    const { notes } = await req.json().catch(() => ({}));

    if (!notes || notes.trim() === "") {
      return jsonResponse({ error: "Notes are required" }, 400);
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      console.error("❌ Missing OPENROUTER_API_KEY in environment.");
      return jsonResponse(
        { error: "Server misconfigured: missing API key" },
        500,
      );
    }

    const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

    const response = await fetch(OR_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // ✅ stable free model
        messages: [
          {
            role: "system",
            content: `You are a flashcard generator. Generate 5 concise question-answer flashcards from the provided notes. Respond strictly in valid JSON format, like this:
            [
              {"question": "Q1", "answer": "A1"},
              {"question": "Q2", "answer": "A2"},
              {"question": "Q3", "answer": "A3"},
              {"question": "Q4", "answer": "A4"},
              {"question": "Q5", "answer": "A5"}
            ]`,
          },
          { role: "user", content: `Notes:\n${notes}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ OpenRouter API Error:", response.status, errText);
      return jsonResponse(
        { error: "OpenRouter API failed", status: response.status, details: errText },
        500,
      );
    }

    const data = await response.json();
    console.log("✅ OpenRouter Response:", JSON.stringify(data, null, 2));

    // Extract model's content
    const flashcardsText = data.choices?.[0]?.message?.content?.trim() || "[]";

    let flashcards;
    try {
      flashcards = JSON.parse(flashcardsText);
    } catch (parseErr) {
      console.error("❌ Parse Error:", parseErr, "\nRaw Output:", flashcardsText);
      return jsonResponse(
        { error: "Invalid JSON returned from model", raw: flashcardsText },
        500,
      );
    }

    return jsonResponse({ flashcards }, 200);
  } catch (err) {
    console.error("❌ Server Error:", err);
    return jsonResponse(
      { error: "Internal Server Error", details: err.message },
      500,
    );
  }
});
