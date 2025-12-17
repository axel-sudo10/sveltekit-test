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
│   │   ├── stundenplan/              # Stundenplan Route
│   │   │   ├── +layout.svelte
│   │   │   └── +page.js
│   │   └── veranstaltung/            # Veranstaltung Route
│   │       └── [id]/                 # Dynamische ID Route
│   │           ├── +layout.svelte
│   │           ├── +page.svelte      # Detail-Seite für Veranstaltung
│   │           └── +page.js          # Load-Funktion mit parallelen API-Requests
│   ├── lib/
│   │   ├── api/                      # Zentralisierte API-Funktionen
│   │   │   └── index.js              # fetchProducts, fetchProduct, fetchBookings
│   │   ├── components/               # Wiederverwendbare Svelte Components (kategorisiert)
│   │   │   ├── booking/
│   │   │   │   ├── BookingButton.svelte      # Buchungs-Link Button
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
import { fetchProducts } from "$lib/api";

export async function load({ fetch }) {
  const productsData = await fetchProducts({ limit: 20, customFetch: fetch });
  return {
    products: productsData.products || productsData.data || [],
  };
}
```
- Nutzt zentralisierte API-Funktionen aus `$lib/api`
- SvelteKit Error-Handling in den API-Funktionen integriert

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

#### BookingButton (`src/lib/components/booking/BookingButton.svelte`)
**Button-Komponente für Buchungs-Links**

Features:
- Generiert korrekte Buchungs-URLs für Produkte und Slots
- Unterstützt verschiedene ID-Quellen (courseId, courses Array, firstCourseId, id)
- Props: `product`, `booking`, `class`

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

## Daten-Logik & Filtering (Veranstaltungen)

Die Detail-Seite `/veranstaltung/[id]` implementiert komplexe Logik zur Filterung von Kursen und Buchungen.

### 1. Datenstruktur
- **Produkt (Parent):** Das Hauptprodukt (z.B. ID 66 "QiGong"). Kann "Courses" enthalten.
- **Kurse (Children):** In `product.courses` enthalten. Eigene Entitäten mit `startDate`, `endDate`, `availableTillDate`.
- **Slots (Bookings):**
    - Hängen am **Parent Product** (`linkedProductId = ParentID`).
    - Sind über das Feld `courseId` einem spezifischen Kurs zugeordnet.
    - "Verwaiste" Buchungen (ohne `courseId`) können existieren, werden aber gefiltert.

### 2. Kurs-Gültigkeit (Active State)
Ein Kurs wird als "aktiv" angezeigt, wenn:
1.  **Priorität:** `availableTillDate` existiert und liegt in der **Zukunft**.
    - Dies erlaubt die Anzeige von Kursen, deren Sessions (`endDate`) bereits vorbei sind, die aber noch buchbar/sichtbar sein sollen (z.B. zur Nachschau).
2.  **Fallback:** Wenn kein `availableTillDate` gesetzt ist, muss `endDate` (letzte Session) in der **Zukunft** liegen.

-> Abgelaufene Kurse werden komplett ausgeblendet.

### 3. Buchungs-Filterung (Global & Pro Kurs)
Buchungen werden auf zwei Ebenen gefiltert:
1.  **Pro Kurs:** Nur Buchungen, die zu diesem Kurs gehören (`courseId`).
2.  **Global (Fallback):** Wenn keine Kurse angezeigt werden (oder als Fallback-Liste), wird die Parent-Booking-Liste gefiltert.

**Filter-Regeln:**
- **Zu früh:** Buchung `startDate` < Kurs `startDate` -> **Ausgeblendet** (Verhindert Anzeige von Setup-Terminen oder Fehlbuchungen).
- **Inaktiver Kurs:** Buchungen, die zu einem inaktiven/abgelaufenen Kurs gehören -> **Ausgeblendet**.
- **Vergangenheit:** 
    - Generell werden vergangene Buchungen angezeigt, **sofern** der zugehörige Kurs noch als "aktiv" gilt (siehe oben).
    - Verwaiste Buchungen (ohne `courseId`) in der Vergangenheit werden ausgeblendet.

### 4. API Besonderheiten
- `fetchBookings` muss `await` verwenden (Promise).
- Buchungs-Daten haben Felder `startDate`/`endDate` (nicht `start`/`end` wie manchmal angenommen).
- Pagination Limit ist standardmäßig 60. Für Kurse mit vielen Slots wurde es auf **300** erhöht, um Lücken in der Zukunft zu vermeiden.

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

### Zentralisierte API-Funktionen (`src/lib/api/index.js`)

Das Projekt nutzt zentralisierte API-Funktionen für konsistente Datenabfragen:

```javascript
import { fetchProducts, fetchProduct, fetchBookings } from "$lib/api";

// Alle Produkte laden
const data = await fetchProducts({ limit: 200, customFetch: fetch });

// Einzelnes Produkt laden
const product = await fetchProduct(id, fetch);

// Buchungen für Produkt laden
const bookings = await fetchBookings(productId, { limit: 60, customFetch: fetch });
```

**Vorteile:**
- Einheitliche Error-Handling
- Konsistente Query-Parameter
- Wiederverwendbar in allen Load-Funktionen

### Externe API
**Basis URL:** `https://backbone-web-api.production.regensburg.delcom.nl`

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
- [x] **API-Funktionen zentralisiert**: `src/lib/api/index.js` mit fetchProducts, fetchProduct, fetchBookings
- [x] **BookingButton Komponente**: Buchungs-Links für Produkte und Slots

### Bestehende Issues
1. **Filterlogik nicht implementiert**: FilterMenu ist vorhanden, aber Filter werden nicht auf ProductList angewendet

### Nächste Schritte
- [ ] Filter-Logik implementieren (Abos & Kategorien anwenden)
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

**Letzte Aktualisierung:** 2025-12-17
**Projekt Status:** In aktiver Entwicklung
**Letzte Änderung:** API-Funktionen zentralisiert, BookingButton hinzugefügt
