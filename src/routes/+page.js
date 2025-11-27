/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const res = await fetch("/api/products");
  const responseData = await res.json();

  // Debug: Log what the API returns
  console.log("Full API response:", responseData);
  console.log("Response keys:", Object.keys(responseData));

  // Extract products array from API response
  const products = responseData.data || responseData.products || [];

  return { products };
}
