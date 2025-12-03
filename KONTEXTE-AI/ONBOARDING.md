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
│   ├── routes/                       # SvelteKit Routing
│   │   ├── +layout.svelte            # Root Layout Component
│   │   ├── +page.svelte              # Startseite
│   │   ├── +page.js                  # Daten laden für die Startseite
│   │   └── veranstaltung/          # veranstaltung Route
│   │       └── [id]/                 # Dynamische ID Route
│   │           ├── +page.svelte      # Detail-Seite für Veranstaltung
│   │           └── +page.js          # Load-Funktion mit parallelen API-Requests
│   ├── lib/
│   │   ├── components/               # Wiederverwendbare Svelte Components (kategorisiert)
│   │   │   ├── booking/
│   │   │   │   └── BookingSchedule.svelte    # Wochen-Pagination für Buchungszeiten
│   │   │   ├── course/
│   │   │   │   └── CourseIndicator.svelte    # Kurs-Indikator Badge
│   │   │   ├── filter/
│   │   │   │   └── FilterMenu.svelte         # Filtermenu für Abos und Kategorien
│   │   │   └── product/
│   │   │       ├── ProductDetails.svelte     # Produktdetails mit Bild, Beschreibung
│   │   │       ├── ProductList.svelte        # Produktlisten-Container
│   │   │       └── ProductSlot.svelte        # Einzelne Produktkarte
│   │   ├── assets/                   # Statische Assets
│   │   │   └── favicon.svg
│   │   └── index.js                  # Library Exports
│   └── app.css                       # Globale Styles
├── package.json                      # Abhängigkeiten & Scripts
└── vite.config.js                   # Vite Konfiguration (optional)
```

## Hauptkomponenten & Datenfluss

### 1. Produktdaten laden (`src/routes/+page.js`)
```javascript
export async function load({ fetch }) {
  const res = await fetch(
    'https://backbone-web-api.production.regensburg.delcom.nl/products?join=tags&join=translations&join=location&isActive=1&limit=20'
  );
  
  if (!res.ok) {
    error(res.status, 'Failed to fetch products from external API.');
  }
  
  const { data: productsArray } = await res.json();
  return { products: productsArray };
}
```
- Lädt Produktdaten **direkt von der externen API**
- Nutzt SvelteKit Error-Handling mit `error()`

### 2. Veranstaltungs-Details mit parallelen Requests (`src/routes/veranstaltung/[id]/+page.js`)
```javascript
export async function load({ fetch, params }) {
  // Parallele Requests mit Promise.all()
  const [proRes, boRes] = await Promise.all([
    fetch(`https://...delcom.nl/products/${params.id}?join=tags&join=location&join=documents&join=translations&join=linkedSubscriptions`),
    fetch(`https://...delcom.nl/bookings?limit=60&page=1&s={"linkedProductId":{"$in":[${params.id}]}}&fields=startDate,endDate`)
  ]);

  // Error Handling für beide Requests
  if (!proRes.ok) error(proRes.status, "Failed to fetch product");
  if (!boRes.ok) error(boRes.status, "Failed to fetch bookings");

  const product = await proRes.json();
  const bookings = await boRes.json();

  return { product, bookings };
}
```
- **Parallele API-Requests** mit `Promise.all()` für bessere Performance
- Lädt Product + Bookings gleichzeitig
- Fehlerbehandlung mit SvelteKit `error()` Helper

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

#### FilterMenu (`src/lib/components/filter/FilterMenu.svelte`)
- Nimmt `subscriptions`, `categories`, und `onFilterChange` Handler entgegen
- Gibt gefilterte Optionen an Parent-Komponente zurück

#### ProductList (`src/lib/components/product/ProductList.svelte`)
- Rendert mehrere ProductSlot Komponenten
- Grid Layout (1 Spalte mobil, 2 Tablets, 3 Desktop)
- Nutzt Svelte 5 `$props()` für Props-Handling

#### ProductSlot (`src/lib/components/product/ProductSlot.svelte`)
- Zeigt einzelne Produktkarte an
- Enthält Produktinformationen wie Preis, Startdatum, Beschreibung
- Verlinkt auf `/veranstaltung/[id]` für Details
- Nutzt CourseIndicator für Kurs-Anzeige

#### ProductDetails (`src/lib/components/product/ProductDetails.svelte`)
- Zeigt detaillierte Produktinformationen
- Lädt Produktbild aus `documents` Array
- Zeigt Beschreibung aus `translations`
- Integriert BookingSchedule für Zeitplan
- Nutzt CourseIndicator für Kurs-Anzeige
- Props: `product`, `bookings`

#### BookingSchedule (`src/lib/components/booking/BookingSchedule.svelte`)
**Komponente für Buchungszeiten mit Wochen-Pagination**

Features:
- Gruppiert Bookings nach Kalenderwochen (Mo-So)
- Teilt Zeiten in Vormittag (< 12:00) und Nachmittag (≥ 12:00)
- Wochen-Navigation mit Vor/Zurück Buttons
- Startet automatisch bei der aktuellen Woche
- Zeigt Verfügbarkeitsstatus: ✓ Frei / ✗ Voll
- Responsive: Mobile übereinander, Desktop nebeneinander

#### CourseIndicator (`src/lib/components/course/CourseIndicator.svelte`)
- Zeigt Badge an, wenn Produkt ein Kurs ist (`isCourse === true`)
- Wird in ProductSlot und ProductDetails verwendet
- Props: `product`

Datenstruktur:
```javascript
// API Response
{
  data: [
    {
      id: 2456,
      currentParticipantCount: 4,
      availableParticipantCount: 2,  // > 0 = Frei
      maxParticipants: null,          // wird berechnet
      startDate: "2025-04-28T14:00:00.000Z",
      endDate: "2025-04-28T15:59:00.000Z"
    }
  ],
  count: 38,
  total: 38
}
```

Logik:
- Extrahiert `bookings.data` Array aus API Response
- Berechnet `maxParticipants` falls `null`: `currentParticipantCount + availableParticipantCount`
- `available = availableParticipantCount > 0`

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

### ✅ Abgeschlossene Aufgaben
- [x] **Komponenten-Namen korrigiert**: `filterMenu` → `FilterMenu`, `productSlot` → `ProductSlot` (PascalCase)
- [x] **Komponenten-Struktur reorganisiert**: In kategorische Subdirectories aufgeteilt (booking/, course/, filter/, product/)
- [x] **Alle Importe aktualisiert**: Routes und Komponenten verwenden neue Pfade

### Bestehende Issues
1. **Filterlogik nicht implementiert**: FilterMenu ist vorhanden, aber Filter werden nicht auf ProductList angewendet
2. **Produktdetail-Route existiert**: `/veranstaltung/[id]/` ist implementiert und funktioniert

### Nächste Schritte
- [ ] Filter-Logik implementieren (Abos & Kategorien anwenden)
- [ ] Error Handling für API-Fehler verbessern
- [ ] Loading States hinzufügen
- [ ] TypeScript Migration (optional)

## Entwickler-Tipps

### Debugging
- Browser Console: API-Aufrufe und Daten werden mit `console.log()` dokumentiert
- Network Tab: Prüfe `/api/products` Anfragen und Responses
- Svelte DevTools: Browser Extension für Svelte Component Inspection

### Hot Module Replacement (HMR)
- Änderungen an `.svelte` und `.js` Dateien werden live reloaded
- Keine manuelle Seiten-Aktualisierung nötig

### CSS Klassen & Organisation
- Alle Klassen müssen in den Tailwind Config registriert sein
- Custom CSS in `src/app.css` für globale Styles
- **Alle Custom Klassen sind in 3 Kategorien organisiert** (siehe `src/app.css` Header):
  1. **LAYOUT CONTAINER** - Flex/Grid Layouts
  2. **FILTER KOMPONENTEN** - Filter-spezifische Elemente
  3. **TEXT & TYPOGRAFIE** - Text-Styling & Überschriften
- Neue Klassen immer in passende Kategorie mit Kommentar einsortieren

## Häufige Aufgaben

### Neue Komponente hinzufügen
1. Neue Komponente in passender Kategorie erstellen:
   - `src/lib/components/booking/` - Buchungs-bezogene Komponenten
   - `src/lib/components/course/` - Kurs-bezogene Komponenten
   - `src/lib/components/filter/` - Filter-bezogene Komponenten
   - `src/lib/components/product/` - Produkt-bezogene Komponenten
2. Svelte 5 Syntax nutzen (`$props()`, `$state()`)
3. In Parent-Komponente importieren
4. Importe mit korrektem relativen Pfad (z.B. `../booking/BookingSchedule.svelte`)

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

**Letzte Aktualisierung:** 2025-12-03
**Projekt Status:** In aktiver Entwicklung - API Integration & Filter-Logik
**Letzte Änderung:** Komponenten-Struktur reorganisiert (booking/, course/, filter/, product/)
