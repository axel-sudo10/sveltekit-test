// export const load = async ({ fetch, params }) => {
//   //const res = await fetch(`/api/items/${params.id}`);
//   const res = await fetch(`/api/items/${params.id}`);
//   const item = await res.json();
//   console.log("fetch", item);
//   return { item };
// };
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const res = await fetch(`/api/items/${params.id}`);
  const item = await res.json();

  return { item };
}
