import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const res = await fetch(
    // https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&join=translations&join=location&limit=20&page=1&s=${ "isActive": 1, "tags.activeState": true, allowAsLinkedProduct": true}
    `https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&join=documents&join=translations&join=location&limit=100&page=1&s=${encodeURIComponent(JSON.stringify({ isActive: 1, "tags.activeState": true, allowAsLinkedProduct: true }))}`,
  );
  if (!res.ok) {
    error(res.status, "Failed to fetch products from external API.");
  }

  const productsData = await res.json();

  //TODO: spätere implemation von fetch requests für abonnements und kategorien
  return {
    products: productsData.products || productsData.data || [],
  };
}
