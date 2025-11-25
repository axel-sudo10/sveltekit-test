import { json } from '@sveltejs/kit';

/**
 * Handles GET requests to /api/products.
 * This acts as a proxy to the external API, fetching data from it.
 * @type {import('./$types').RequestHandler}
 */
export async function GET() {
  const externalApiUrl = `https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&s={"isActive":1,"tags.activeState":true, "allowAsLinkedProduct":true }&limit=20&page=1`;

  try {
    const res = await fetch(externalApiUrl);
    if (!res.ok) {
      // Handle HTTP errors
      throw new Error(`External API responded with status ${res.status}`);
    }
    const data = await res.json();
    // Return the data from the external API directly
    return json(data);
  } catch (error) {
    console.error('Error fetching from external API in +server.js:', error);
    // Return an appropriate error response
    return json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
  }
}
