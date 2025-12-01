import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // params.id enthält die ID aus der URL (z.B. /veranstaltungen/29 → params.id = "29")
  const res = await fetch(
    `https://backbone-web-api.production.regensburg.delcom.nl/products/${params.id}?join=tags&join=location&join=documents&join=translations&join=linkedSubscriptions`,
  );

  if (!res.ok) {
    error(res.status, "Failed to fetch product from external API.");
  }

  const product = await res.json();

  return {
    product,
  };
}
