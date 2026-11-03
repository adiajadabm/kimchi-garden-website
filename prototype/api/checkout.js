// POST /api/checkout — turns the cart into a Stripe Checkout page and returns its URL.
// Stripe hosts the card form, so card numbers never touch this site.
// Needs STRIPE_SECRET_KEY (use the sk_test_ key until the restaurant is ready to take real money).
import Stripe from "stripe";
import { priceList } from "./_menu.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const TAX_RATE = 0.1025;       // Berkeley sales tax; confirm with the restaurant
const DELIVERY_FEE = 4.99;     // replace with a live DoorDash Drive / Uber Direct quote when delivery is set up
const cents = (n) => Math.round(n * 100);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: "Payments are not set up yet." });

  const { items, mode, name, phone, address, note, pickupTime } = req.body ?? {};
  const prices = priceList();

  // Never trust prices from the browser: look every item up in menu.js
  const lines = (Array.isArray(items) ? items : [])
    .filter((i) => prices[i?.name] && Number.isInteger(i.qty) && i.qty > 0 && i.qty <= 20)
    .slice(0, 30);
  if (!lines.length) return res.status(400).json({ error: "Your order is empty." });
  if (!String(name ?? "").trim() || String(phone ?? "").replace(/\D/g, "").length < 10) return res.status(400).json({ error: "Name and phone are required." });
  const delivery = mode === "delivery";
  if (delivery && String(address ?? "").trim().length < 5) return res.status(400).json({ error: "Delivery needs an address." });

  const subtotal = lines.reduce((s, i) => s + prices[i.name].price * i.qty, 0);
  const lineItems = lines.map((i) => ({
    quantity: i.qty,
    price_data: { currency: "usd", unit_amount: cents(prices[i.name].price), product_data: { name: `${i.name} (${prices[i.name].kr})` } },
  }));
  if (delivery) lineItems.push({ quantity: 1, price_data: { currency: "usd", unit_amount: cents(DELIVERY_FEE), product_data: { name: "Delivery" } } });
  lineItems.push({ quantity: 1, price_data: { currency: "usd", unit_amount: cents(subtotal * TAX_RATE), product_data: { name: "Sales tax (10.25%)" } } });

  const origin = `https://${req.headers.host}`;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/?paid=1&session_id={CHECKOUT_SESSION_ID}#order`,
    cancel_url: `${origin}/#order`,
    // The kitchen ticket travels with the payment; api/stripe-webhook.js reads it once payment succeeds
    metadata: {
      mode: delivery ? "delivery" : "pickup",
      name: String(name).slice(0, 80),
      phone: String(phone).slice(0, 30),
      address: delivery ? String(address).slice(0, 200) : "",
      note: String(note ?? "").slice(0, 300),
      pickup_time: delivery ? "" : String(pickupTime ?? "asap").slice(0, 20),
      items: lines.map((i) => `${i.qty}x ${i.name}`).join(", ").slice(0, 490),
    },
  });
  return res.status(200).json({ url: session.url });
}
