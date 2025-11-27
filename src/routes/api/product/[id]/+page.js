import { json, error } from "@sveltejs/kit";

// GET-Endpoint für Produktliste von externer API
export async function GET({ fetch }) {
  // URL mit Filter, Joins und Pagination
  const externalApiUrl = `https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&join=translations&join=location&limit=20&page=1&s=${encodeURIComponent(JSON.stringify({ isActive: 1, "tags.activeState": true, allowAsLinkedProduct: true }))}`;

  // Daten von externer API abrufen
  const res = await fetch(externalApiUrl);

  // Bei Fehler: HTTP-Statuscode und Fehlermeldung zurückgeben
  if (!res.ok) {
    error(res.status, "Failed to fetch products from external API.");
  }

  // Response als JSON parsen und zurückgeben
  const data = await res.json();
  return json(data);
}
