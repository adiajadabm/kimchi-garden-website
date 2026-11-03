// POST /api/stripe-webhook — Stripe calls this when a payment goes through.
// It sends the order to the kitchen. Needs STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and KITCHEN_WEBHOOK_URL
// (for example a Slack or Discord channel the restaurant's tablet keeps open, or their POS's order inbox).
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const config = { api: { bodyParser: false } };   // Stripe's signature check needs the raw body

async function rawBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  let event;
  try {
    event = stripe.webhooks.constructEvent(await rawBody(req), req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send("Bad signature");
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object, m = s.metadata ?? {};
    const ticket = [
      `NEW ${m.mode === "delivery" ? "DELIVERY" : "PICKUP"} ORDER · $${(s.amount_total / 100).toFixed(2)} paid`,
      m.items,
      `${m.name} · ${m.phone}`,
      m.mode === "delivery" ? `Deliver to: ${m.address}` : `Pickup: ${m.pickup_time === "asap" ? "ASAP" : m.pickup_time}`,
      m.note ? `Note: ${m.note}` : "",
    ].filter(Boolean).join("\n");

    if (process.env.KITCHEN_WEBHOOK_URL) {
      await fetch(process.env.KITCHEN_WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ticket, content: ticket }),   // Slack reads "text", Discord reads "content"
      });
    }
    // Delivery orders: request a driver here with DoorDash Drive or Uber Direct once the restaurant has an account
    // (both take the pickup and dropoff addresses and return a tracking link to text the customer).
  }
  return res.status(200).json({ received: true });
}
