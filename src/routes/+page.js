// export const load = async ({ fetch, params }) => {
//   //const res = await fetch(`/api/items/${params.id}`);
//   const res = await fetch(`/api/items/${params.id}`);
//   const item = await res.json();
//   console.log("fetch", item);
//   return { item };
// };

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  // This fetch call now goes to your local API endpoint at
  // src/routes/api/products/+server.js.
  // It transparently works during Server-Side Rendering and client-side navigation.
  const res = await fetch('/api/products');
  const item = await res.json(); // 'item' will now contain the data fetched by your +server.js

  // The 'item' object (containing the response from your local API)
  // will be passed as the `data` prop to your +page.svelte component.
  return { item };
}
