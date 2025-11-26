import { json, error } from '@sveltejs/kit';

export async function GET({ fetch }) {
  const externalApiUrl = `https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&s={"isActive":1,"tags.activeState":true, "allowAsLinkedProduct":true }&limit=20&page=1&join=translations`;

  try {
    const res = await fetch(externalApiUrl);
    if (!res.ok) {
      throw error(res.status, `Failed to fetch products from external API.`);
    }
    const data = await res.json();
    console.log('Data from external API (in +server.js):', data);
    return json(data);
  } catch (err) {
    console.error('Error in /api/products/+server.js:', err);
    if (err.status) {
      throw err;
    }
    throw error(500, 'An unexpected error occurred while fetching products.');
  }
}
