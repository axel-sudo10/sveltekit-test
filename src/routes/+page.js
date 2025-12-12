import { fetchProducts } from "$lib/api";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const productsData = await fetchProducts({ customFetch: fetch });

  //TODO: spätere implemation von fetch requests für abonnements und kategorien
  return {
    products: productsData.products || productsData.data || [],
  };
}
