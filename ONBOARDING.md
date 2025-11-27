# Onboarding: SvelteKit Craft CMS Test Projekt

## Projektübersicht

Dieses Projekt ist eine **SvelteKit-basierte Webapplikation**, die Produkte von einer externen API abruft und diese mit Filterung und detaillierten Ansichten darstellt. Das Projekt dient als Testumgebung für die Integration mit einem Backend-API und die Implementierung einer modernen Frontend-Architektur.

### Stack
- **Frontend Framework**: SvelteKit 2.43.2
- **UI Framework**: Svelte 5.39.5
- **Styling**: Tailwind CSS 4.1.17
- **Build Tool**: Vite 7.1.7
- **JavaScript**: ES Modules

## Projektstruktur

```
sveltekit-test/
├── src/
│   ├── routes/                    # SvelteKit Routing
│   │   ├── +layout.svelte         # Root Layout Component
│   │   ├── +page.svelte           # Startseite
│   │   ├── +page.js               # Daten laden für die Startseite
│   │   └── api/
│   │       ├── products/
│   │       │   └── +server.js     # API Endpoint für Produktliste
│   │       ├── bookings/
│   │       │   └── +page.js       # Buchungen API
│   │       └── product/[id]/
│   │           └── +page.js       # Einzelnes Produkt Detail
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
└── vite.config.js                # Vite Konfiguration (optional)
```

## Hauptkomponenten & Datenfluss

### 1. Produktdaten laden (`src/routes/+page.js`)
```javascript
export async function load({ fetch }) {
  const res = await fetch('/api/products');
  const { data: productsArray } = await res.json();
  return { products: productsArray };
}
```
- Lädt Produktdaten von der lokalen API
- Diese Daten werden auf der Startseite verfügbar gemacht

### 2. API Endpoint (`src/routes/api/products/+server.js`)
- Ruft eine externe API ab: `https://backbone-web-api.production.regensburg.delcom.nl/`
- Parameter:
  - `join=tags` - Verlinkt Tags zu Produkten
  - `join=translations` - Verlinkt Übersetzungen
  - `join=location` - Verlinkt Standort-Informationen
  - `isActive=1` - Nur aktive Produkte
  - `limit=20` - Maximal 20 Produkte pro Seite
- Fehlerbehandlung mit SvelteKit Error-Handling

### 3. Startseite (`src/routes/+page.svelte`)
**Funktionalität:**
- Zeigt FilterMenu (Abos & Kategorien)
- Rendert ProductList mit API-Daten
- Verwaltet aktuelle Filter als State

**Filter Optionen:**
```javascript
let subscriptions = [
  "B1 1 Monat Basic",
  "B2 3 Monate Basic",
  "B3 1 Jahr Basic",
];
let categories = ["Bewegungskünste und Turnen", "Denksport", "Tools"];
```

### 4. Komponenten

#### FilterMenu (`src/lib/components/filterMenu.svelte`)
- Nimmt `subscriptions`, `categories`, und `onFilterChange` Handler entgegen
- Gibt gefilterte Optionen an Parent-Komponente zurück

#### ProductList (`src/lib/components/productList.svelte`)
- Rendert mehrere ProductSlot Komponenten
- Grid Layout (1 Spalte mobil, 2 Tablets, 3 Desktop)
- Nutzt Svelte 5 `$props()` für Props-Handling

#### ProductSlot (`src/lib/components/productSlot.svelte`)
- Zeigt einzelne Produktkarte an
- Enthält Produktinformationen wie Preis, Startdatum, Beschreibung

## Setup & Entwicklung

### Installation
```bash
npm install
```

### Entwicklungsserver starten
```bash
npm run dev
```
- Dev Server läuft standard auf `http://localhost:5173`
- Mit `--open` Flag öffnet sich die App automatisch im Browser

### Production Build
```bash
npm run build
npm run preview  # Preview der Production Build
```

## Wichtige Konzepte

### Svelte 5 Runes
Das Projekt nutzt Svelte 5 mit modernen "Runes": 
- `$props()` - Für Props-Handling (ersetzt Props-Validierung)
- `$state()` - Für reaktiven State (ersetzt reactive declarations)
- `$effect()` - Für Side Effects (ersetzt reaktive Statements)

### SvelteKit Load Funktionen
- `+page.js` - Server-side/Universal load funktionen
- `+server.js` - API Endpoints (GET, POST, etc.)
- `+layout.js` - Layout-spezifische Daten

### Tailwind CSS
- Utility-First CSS Framework
- Responsive Design mit Breakpoints: `sm`, `md`, `lg`, `xl`
- Klassen wie `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` für responsive Layouts

## API Integration

### Externe API
**Basis URL:** `https://backbone-web-api.production.regensburg.delcom.nl/products`

**Query Parameter:**
- `join=tags|translations|location` - Daten-Joins
- `s=` - Filter Objekt
- `limit=20` - Pagination Limit
- `page=1` - Seite

**Beispiel Response Struktur:**
```javascript
{
  "data": [
    {
      "id": 123,
      "startDate": "2024-01-15",
      "slotMinuts": 60,
      "translations": [{ "description": "..." }],
      "location": { "description": "..." },
      "price": 29.99,
      "isCourse": true
    }
  ]
}
```

## Bekannte Probleme & Verbesserungen

### Bestehende Issues
1. **Tippfehler im Komponenten-Namen**: `poductDetails.svelte` statt `productDetails.svelte`
2. **Filterlogik nicht implementiert**: FilterMenu ist vorhanden, aber Filter werden nicht angewendet
3. **Produktdetail-Route nicht aktiv**: `/api/product/[id]/+page.js` existiert, ist aber nicht verlinkt

### Nächste Schritte
- [ ] Filter-Logik implementieren (Abos & Kategorien)
- [ ] Produktdetails-Seite aufbauen mit Modal/neue Route
- [ ] Error Handling für API-Fehler verbessern
- [ ] Loading States hinzufügen
- [ ] Komponenten-Namen korrigieren
- [ ] TypeScript Migration (optional)

## Entwickler-Tipps

### Debugging
- Browser Console: API-Aufrufe und Daten werden mit `console.log()` dokumentiert
- Network Tab: Prüfe `/api/products` Anfragen und Responses
- Svelte DevTools: Browser Extension für Svelte Component Inspection

### Hot Module Replacement (HMR)
- Änderungen an `.svelte` und `.js` Dateien werden live reloaded
- Keine manuelle Seiten-Aktualisierung nötig

### CSS Klassen
- Alle Klassen müssen in den Tailwind Config registriert sein
- Custom CSS in `src/app.css` für globale Styles

## Häufige Aufgaben

### Neue Komponente hinzufügen
1. Datei in `src/lib/components/` erstellen
2. Svelte 5 Syntax nutzen (`$props()`, `$state()`)
3. In Parent-Komponente importieren

### API Endpoint erweitern
1. Neue Route in `src/routes/api/` erstellen (z.B. `search/+server.js`)
2. GET/POST/DELETE Handler exportieren
3. Mit `fetch('/api/search')` im Frontend aufrufen

### Styling ändern
1. Tailwind Klassen direkt in Komponenten nutzen
2. Spezifische Styles in `<style>` Block der Komponente
3. Globale Styles in `src/app.css`

## Ressourcen

- [SvelteKit Dokumentation](https://kit.svelte.dev)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Dokumentation](https://vitejs.dev)

## Git Workflow

Aktueller Stand: Haupt-Branch `main`
- Arbeite auf Feature-Branches
- Pull Requests vor Merge zu `main`

```bash
git checkout -b feature/neue-funktion
# ... Änderungen machen ...
git add .
git commit -m "Add neue-funktion"
git push origin feature/neue-funktion
```

---

**Letzte Aktualisierung:** 2025-11-27
**Projekt Status:** In aktiver Entwicklung - API Integration & UI-Refactoring
