# Putting the site online

The page works on its own. Two features get better once it runs on a host with serverless functions (Vercel is the simplest; deploy this `prototype` folder as the project):

| Feature | File | Without it | With it |
| --- | --- | --- | --- |
| Live reviews | `api/reviews.js` | One real Yelp quote plus "Sample" cards | Up to 3 Yelp excerpts and 5 Google reviews, plus real ratings and counts |
| Order helper AI | `api/ask.js` | Built-in menu matcher (keywords like "cold", "spicy", "cheap") | Claude answers any question in plain language, picking only from the menu |
| Online ordering | `api/checkout.js`, `api/stripe-webhook.js` | Demo checkout, clearly labeled, no payment | Real payment on Stripe's secure page; the paid order is posted to the kitchen's channel |

## How an order flows

1. The guest adds dishes, picks pickup or delivery, and enters name, phone and pickup time or address.
2. `api/checkout.js` re-prices everything from `menu.js` (never from the browser) and opens a Stripe Checkout page.
3. After payment, Stripe calls `api/stripe-webhook.js`, which posts the ticket to `KITCHEN_WEBHOOK_URL`.
4. Delivery orders: book a DoorDash Drive or Uber Direct driver at that step (needs the restaurant's own account; the webhook marks the spot).

The menu and prices live in one place, `menu.js`. Change a price there and both the page and the payment server follow.

## Keys to add in the host's environment settings

| Name | Where to get it | Cost |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | console.anthropic.com | Pay per use |
| `YELP_API_KEY`, `YELP_BUSINESS_ID` | Yelp developer site (Yelp Places / Fusion API); the business ID is in the Yelp business search result | Paid plans; check current pricing |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe dashboard (the restaurant's own account). Start with test keys; point a webhook at `/api/stripe-webhook` for `checkout.session.completed` | About 2.9% + 30¢ per card payment |
| `KITCHEN_WEBHOOK_URL` | An incoming-webhook URL for a Slack or Discord channel the kitchen watches (or the POS's order inbox) | Free |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Google Cloud console, Places API (New); find the Place ID with Google's Place ID finder | Reviews are a premium field; a free monthly allowance applies |

Never put these keys in `index.html`. They live only on the server.

## Before launch

- Read Yelp's Display Requirements and Google's Places API policies: both need their logo or name, the author's name near each review, and a link back.
- Swap the "Review us on Google" link for Google's direct write-a-review link once you have the Place ID: `https://search.google.com/local/writereview?placeid=<GOOGLE_PLACE_ID>`.
- Ordering: Yelp has no public API for placing orders. Point "Order online" at the restaurant's own online ordering (Toast, Square or ChowNow, for example) or its delivery app pages.
