import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const res = await fetch(
    `https://backbone-web-api.production.regensburg.delcom.nl/products/${params.id}?join=tags&join=translations&join=location`,
  );

  if (!res.ok) {
    error(res.status, "Failed to fetch product from external API.");
  }

  const product = await res.json();
  return { product };
}
