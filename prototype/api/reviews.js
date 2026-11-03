// Live reviews for the review wall (GET /api/reviews), from the Yelp Fusion API and Google Places API (New).
// Keys stay on the server: YELP_API_KEY, YELP_BUSINESS_ID, GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID.
// Either source can be left unset; the page shows whatever comes back and keeps its samples if nothing does.
// Before launch, read both display rules: Yelp's Display Requirements and Google's Places API policies
// (logos, author names next to each review, links back, and limits on caching).

async function fromYelp() {
  const key = process.env.YELP_API_KEY, id = process.env.YELP_BUSINESS_ID;
  if (!key || !id) return null;
  const headers = { Authorization: `Bearer ${key}` };
  const [biz, rev] = await Promise.all([
    fetch(`https://api.yelp.com/v3/businesses/${encodeURIComponent(id)}`, { headers }).then((r) => (r.ok ? r.json() : null)),
    fetch(`https://api.yelp.com/v3/businesses/${encodeURIComponent(id)}/reviews?limit=3&sort_by=yelp_sort`, { headers }).then((r) => (r.ok ? r.json() : null)),
  ]);
  if (!biz) return null;
  return {
    summary: { rating: biz.rating, count: biz.review_count, url: biz.url },
    reviews: (rev?.reviews ?? []).map((r) => ({
      src: "yelp", text: r.text, rating: r.rating, author: r.user?.name ?? "Yelp user",
      when: (r.time_created ?? "").slice(0, 10), url: r.url ?? biz.url,
    })),
  };
}

async function fromGoogle() {
  const key = process.env.GOOGLE_PLACES_API_KEY, id = process.env.GOOGLE_PLACE_ID;
  if (!key || !id) return null;
  const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri" },
  });
  if (!r.ok) return null;
  const place = await r.json();
  return {
    summary: { rating: place.rating, count: place.userRatingCount, url: place.googleMapsUri },
    reviews: (place.reviews ?? []).map((v) => ({
      src: "google", text: v.text?.text ?? v.originalText?.text ?? "", rating: v.rating,
      author: v.authorAttribution?.displayName ?? "Google user",
      when: v.relativePublishTimeDescription ?? "", url: v.googleMapsUri ?? place.googleMapsUri,
    })).filter((v) => v.text),
  };
}

export default async function handler(req, res) {
  const [yelp, google] = await Promise.all([fromYelp().catch(() => null), fromGoogle().catch(() => null)]);
  // Interleave so both sources show up near the front of the wall
  const a = yelp?.reviews ?? [], b = google?.reviews ?? [], reviews = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i]) reviews.push(a[i]); if (b[i]) reviews.push(b[i]); }
  res.setHeader("Cache-Control", "s-maxage=600");
  return res.status(200).json({ yelp: yelp?.summary ?? null, google: google?.summary ?? null, reviews });
}
