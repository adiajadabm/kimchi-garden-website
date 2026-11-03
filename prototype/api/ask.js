// "What should I eat?" — the real AI behind the order helper.
// Runs as a serverless function (Vercel style: POST /api/ask). The page sends the question,
// the last few chat turns and the menu; Claude answers with a short reply and 1–3 dishes from that menu.
// Needs ANTHROPIC_API_KEY set in the hosting dashboard. If this function is missing or fails,
// the page falls back to its built-in menu matcher, so the helper always answers.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string", description: "One or two friendly sentences, under 40 words." },
    picks: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Exact dish name from the menu." },
          why: { type: "string", description: "Why it fits what they asked, under 15 words." },
        },
        required: ["name", "why"],
        additionalProperties: false,
      },
    },
  },
  required: ["reply", "picks"],
  additionalProperties: false,
};

const SYSTEM = `You help guests at Kimchi Garden, a casual Korean restaurant on Durant Ave in Berkeley, decide what to order.
Guests describe a mood, the weather, a craving, a budget or a group size. Recommend 1 to 3 dishes from the menu you are given, using the exact dish names.
Keep the reply warm, short and specific to what they said. A price of null means the price isn't confirmed: say "ask at the counter" rather than guessing.
Only use facts in the menu. Don't promise a dish is vegetarian, vegan or allergen-free; tell them to check with staff.
If the question isn't about food or the restaurant, answer briefly and steer back to the menu.`;

function cleanMenu(menu) {
  if (!Array.isArray(menu)) return [];
  return menu.slice(0, 80).map((m) => ({
    name: String(m.name ?? "").slice(0, 60),
    korean: String(m.korean ?? "").slice(0, 30),
    price: typeof m.price === "number" ? m.price : null,
    description: String(m.description ?? "").slice(0, 160),
    tags: Array.isArray(m.tags) ? m.tags.slice(0, 10).map((t) => String(t).slice(0, 20)) : [],
  })).filter((m) => m.name);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const { question, history, menu } = req.body ?? {};
  const q = String(question ?? "").trim().slice(0, 400);
  const items = cleanMenu(menu);
  if (!q || !items.length) return res.status(400).json({ error: "Send a question and the menu." });

  // Earlier turns, oldest first, ending before the new question
  const past = (Array.isArray(history) ? history : [])
    .slice(-6, -1)
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 600) }));
  while (past.length && past[0].role !== "user") past.shift();

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: ANSWER_SCHEMA } },
      system: `${SYSTEM}\n\nMenu (JSON):\n${JSON.stringify(items)}`,
      messages: [...past, { role: "user", content: q }],
    });

    if (response.stop_reason === "refusal") {
      return res.status(200).json({ reply: "I can only help with the menu. What are you in the mood for?", picks: [] });
    }

    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const answer = JSON.parse(text);
    const names = new Set(items.map((m) => m.name));
    answer.picks = (answer.picks ?? []).filter((p) => names.has(p.name)).slice(0, 3);
    return res.status(200).json(answer);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: "Busy, try again in a moment." });
    if (error instanceof Anthropic.AuthenticationError) return res.status(500).json({ error: "Server API key is missing or wrong." });
    if (error instanceof Anthropic.APIError) return res.status(502).json({ error: `AI service error ${error.status}` });
    return res.status(500).json({ error: "Could not read the AI's answer." });
  }
}
