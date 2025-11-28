# Onboarding: SvelteKit API Test Projekt

## Projektübersicht

Dieses Projekt ist eine **SvelteKit-basierte Webapplikation**, die Produkte von einer externen API abruft und diese mit Filterung und detaillierten Ansichten darstellt. Das Projekt dient als Testumgebung für die Integration mit einem Backend-API und die Implementierung einer modernen Frontend-Architektur.

### Stack
- **Frontend Framework**: SvelteKit
- **UI Framework**: Svelte 5
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **JavaScript**: ES Modules

## Projektstruktur

```
sveltekit-test/
├── src/
│   ├── routes/                    # SvelteKit Routing
│   │   ├── +layout.svelte         # Root Layout Component
│   │   ├── +page.svelte           # Startseite
│   │   ├── +page.js               # Daten laden für die Startseite
│   │   └── api/                   # Routen für API-bezogene Seiten (Anzeige, nicht Endpunkte)
│   │       ├── products/
│   │       │   └── +page.js       # Logik für die Produktlisten-Seite
│   │       ├── bookings/
│   │       │   └── +page.js       # Logik für die Buchungs-Seite
│   │       └── product/[id]/
│   │           └── +page.js       # Logik für die Produktdetail-Seite
│   ├── lib/
│   │   ├── components/            # Wiederverwendbare Svelte Components
│   │   │   ├── filterMenu.svelte  # Filtermenu für Abos und Kategorien
│   │   │   ├── productList.svelte # Produktlisten-Container
│   │   │   ├── productSlot.svelte # Einzelne Produktkarte
│   │   │   └── poductDetails.svelte # Produktdetails (Note: Tippfehler im Namen)
│   │   ├── assets/                # Statische Assets
│   │   │   └── favicon.svg
│   │   └── index.js               # Library Exports
│   └── app.css                    # Globale Styles
├── package.json                   # Abhängigkeiten & Scripts
└── svelte.config.js               # SvelteKit Konfiguration
```

## Hauptkomponenten & Datenfluss

### 1. Produktdaten laden (`src/routes/+page.js`)
Die Produktdaten werden direkt in der universellen `load` Funktion der Startseite von der externen API geladen. Es wird kein lokaler API-Endpunkt als Proxy verwendet.

```javascript
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const res = await fetch(
        `https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&join=translations&join=location&limit=20&page=1&s=${encodeURIComponent(JSON.stringify({ isActive: 1, "tags.activeState": true, allowAsLinkedProduct: true }))}`,
    );

    if (!res.ok) {
        error(res.status, "Failed to fetch products from external API.");
    }

    const productsData = await res.json();

    return {
        products: productsData.products || productsData.data || [],
    };
}
```
- **Datenquelle**: `https://backbone-web-api.production.regensburg.delcom.nl/`
- **Fehlerbehandlung**: SvelteKits `error()` Funktion wird genutzt, um bei fehlerhaften API-Antworten eine Fehlerseite anzuzeigen. Dies ist die etablierte Methode im Projekt.

### 2. Startseite (`src/routes/+page.svelte`)
**Funktionalität:**
- Zeigt FilterMenu (Abos & Kategorien)
- Rendert ProductList mit den via `load` Funktion geladenen Daten.
- Verwaltet aktuelle Filter als State.

**Filter Optionen (Beispiel):**
```javascript
let subscriptions = [
  "B1 1 Monat Basic",
  "B2 3 Monate Basic",
  "B3 1 Jahr Basic",
];
let categories = ["Bewegungskünste und Turnen", "Denksport", "Tools"];
```

### 3. Komponenten

#### FilterMenu (`src/lib/components/filterMenu.svelte`)
- Nimmt `subscriptions`, `categories`, und `onFilterChange` Handler entgegen.
- Gibt gefilterte Optionen an Parent-Komponente zurück.

#### ProductList (`src/lib/components/productList.svelte`)
- Rendert mehrere `productSlot` Komponenten in einem responsiven Grid.
- Nutzt Svelte 5 `$props()` für das Props-Handling.

#### ProductSlot (`src/lib/components/productSlot.svelte`)
- Zeigt eine einzelne Produktkarte mit Preis, Startdatum und Beschreibung.

## Setup & Entwicklung

### Installation
```bash
npm install
```

### Entwicklungsserver starten
```bash
npm run dev
```
- Dev Server läuft standardmäßig auf `http://localhost:5173`.
- Mit `npm run dev -- --open` öffnet sich die App automatisch im Browser.

### Production Build
```bash
npm run build
npm run preview
```

## Wichtige Konzepte

### Svelte 5 Runes
Das Projekt nutzt Svelte 5 mit modernen "Runes" für die Zustandsverwaltung und Reaktivität:
- `$props()` - Deklariert Komponenten-Properties.
- `$state()` - Erstellt reaktiven State.
- `$effect()` - Führt Side Effects aus, wenn Abhängigkeiten sich ändern.

### SvelteKit Load Funktionen
- `+page.js` - Server-side/universelle `load` Funktionen, um Daten für eine Seite zu laden.
- `+server.js` - Werden für die Erstellung von API-Endpunkten genutzt (im Projekt aktuell nicht im Einsatz).

### Tailwind CSS
- Utility-First CSS Framework für schnelles Styling.
- Responsive Design wird über Prefixes wie `md:` und `lg:` realisiert.

## Bekannte Probleme & Verbesserungen

### Bestehende Issues
1. **Tippfehler im Komponenten-Namen**: `poductDetails.svelte` sollte zu `productDetails.svelte` umbenannt werden.
2. **Filterlogik nicht implementiert**: Das `filterMenu` ist vorhanden, aber die Filterung der Produktliste ist noch nicht implementiert.
3. **Produktdetail-Route nicht aktiv**: Die Routen unter `/product/[id]` existieren, sind aber noch nicht von der Produktliste aus verlinkt.
4. **Struktur der API-Routen**: Die `api/` Unterordner enthalten Svelte-Seiten (`+page.svelte`), was unüblich ist. Dies sollte geprüft und ggf. refaktoriert werden.

### Nächste Schritte
- [ ] Filter-Logik implementieren (Abos & Kategorien).
- [ ] Produktdetail-Seite aufbauen und verlinken.
- [ ] Loading States für asynchrone Operationen hinzufügen.
- [ ] Komponenten-Namen korrigieren.
- [ ] TypeScript Migration (optional).

## Entwickler-Tipps

### Debugging
- Browser DevTools (Console & Network Tab) zur Überprüfung von API-Aufrufen.
- Svelte DevTools Browser-Erweiterung zur Inspektion von Komponenten-Zuständen.

---

**Letzte Aktualisierung:** 2025-11-28
**Projekt Status:** In aktiver Entwicklung - API Integration & UI-Refactoring