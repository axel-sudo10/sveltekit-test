import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // Parallele Requests mit Promise.all()
  const [proRes, boRes] = await Promise.all([
    fetch(
      `https://backbone-web-api.production.regensburg.delcom.nl/products/${params.id}?join=tags&join=location&join=documents&join=translations&join=linkedSubscriptions`,
    ),
    fetch(
      `https://backbone-web-api.production.regensburg.delcom.nl/bookings?limit=60&page=1&s={"linkedProductId":{"$in":[${params.id}]}}&fields=startDate,endDate`,
    ),
  ]);

  // Error Handling für Product
  if (!proRes.ok) {
    error(proRes.status, "Failed to fetch product from external API.");
  }

  // Error Handling für Bookings
  if (!boRes.ok) {
    error(boRes.status, "Failed to fetch bookings from external API.");
  }

  // JSON Parsing
  const product = await proRes.json();
  const bookings = await boRes.json();

  return {
    product,
    bookings,
  };
}
