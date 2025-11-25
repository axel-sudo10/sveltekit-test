// File: src/routes/api/product/[id]/+server.js

import { json } from '@sveltejs/kit';

/**
 * Dies ist ein dynamischer GET-Endpunkt. Er fängt Anfragen
 * wie /api/product/1, /api/product/2 etc. ab.
 * Der `id`-Teil der URL wird uns über das `params`-Objekt zur Verfügung gestellt.
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ params }) {
  // Wir extrahieren die ID aus den URL-Parametern.
  const { id } = params;

  // Wir verwenden die ID, um die spezifische Ressource von der externen API abzurufen.
  const response = await fetch(`https://dummyjson.com/products/${id}`); // Beispiel-API
  const product = await response.json();

  // Das abgerufene Produkt wird als JSON zurückgegeben.
  return json(product);
}
