import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // Svelte-native Streaming: Return Promises ohne zu warten
  // Beide Requests starten parallel, aber werden nicht awaitet
  return {
    product: fetchProductWithErrorHandling(fetch, params.id),
    bookings: fetchBookingsWithErrorHandling(fetch, params.id),
  };
}

// Helper: Product mit Error Handling
async function fetchProductWithErrorHandling(fetch, id) {
  const res = await fetch(
    `https://backbone-web-api.production.regensburg.delcom.nl/products/${id}?join=tags&join=location&join=documents&join=translations&join=linkedSubscriptions`,
  );

  if (!res.ok) {
    error(res.status, "Failed to fetch product from external API.");
  }

  return await res.json();
}

// Helper: Bookings mit Error Handling
async function fetchBookingsWithErrorHandling(fetch, id) {
  const res = await fetch(
    `https://backbone-web-api.production.regensburg.delcom.nl/bookings?limit=60&page=1&s={"linkedProductId":{"$in":[${id}]}}`,
  );

  if (!res.ok) {
    error(res.status, "Failed to fetch bookings from external API.");
  }

  return await res.json();
}
