import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const res = await fetch("src/routes/api/products/+page.js");
  if (!res.ok) {
    error(res.status, "Failed to fetch products from external API.");
  }

  const productsData = await res.json();

  return {
    products: productsData.products || productsData.data || [],
  };
}
