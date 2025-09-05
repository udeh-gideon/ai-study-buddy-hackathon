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

    const HF_API_KEY = Deno.env.get("HF_API_KEY"); // ✅ fixed key name
    const HF_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Generate 5 question-answer flashcards from these notes:\n\n${notes}`,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("HF Error:", errText);
      return jsonResponse({ error: "Hugging Face API failed", details: errText }, 500);
    }

    const data = await response.json();

    return jsonResponse({ flashcards: data }, 200);

  } catch (err) {
    console.error("Server Error:", err);
    return jsonResponse({ error: "Internal Server Error", details: err.message }, 500);
  }
});
