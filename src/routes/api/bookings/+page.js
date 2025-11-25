// File: src/routes/api/bookings/+server.js

import { json } from '@sveltejs/kit';

/**
 * Diese Funktion dient als GET-Endpunkt für die Ressource "bookings".
 * Wir kapseln hier den direkten Zugriff auf die externe API.
 * Das hat den Vorteil, dass wir die Datenquelle austauschen können,
 * ohne das Frontend anpassen zu müssen.
 * @type {import('./$types').RequestHandler}
 */
export async function GET() {
  // Annahme: Dies ist die URL zu Ihrer externen, öffentlichen API.
  const response = await fetch('https://dummyjson.com/carts'); // Beispiel-API
  const data = await response.json();

  // Wir verwenden die `json`-Hilfsfunktion von SvelteKit.
  // Sie erstellt eine `Response` mit dem korrekten `Content-Type: application/json`.
  return json(data.carts);
}
