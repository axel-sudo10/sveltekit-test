
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const res = await fetch(
    `https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&s={"isActive":1,"tags.activeState":true, "allowAsLinkedProduct":true }&limit=20&page=1`,
  );
  const item = await res.json();

  return { item };
}