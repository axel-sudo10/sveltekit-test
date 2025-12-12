import { fetchProducts } from "$lib/api";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const productsData = await fetchProducts({ limit: 20, customFetch: fetch });

  return {
    products: productsData.products || productsData.data || [],
  };
}
