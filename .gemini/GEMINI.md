Projekt informationen:
svelte api test projekt mit js und tailwind

erstelle keine +server.js!!!

## Workflow
1. Denke über Aufgabe/Problem nach
2. Nutze SvelteKit MCP für Dokumentation
3. Bei Bedarf zusätzlich Context7 MCP für weitere Docs
4. Erstelle Todo-Liste und arbeite sie ab

## Dokumentation-Herangehen
- Nur das Nötigste schreiben
- Knapp und strukturiert
- Keine Überdokumentation
- Fokus auf Kern-Infos

## CSS Klassen Organisation
Alle Custom CSS Klassen in `src/app.css` sind in 3 Kategorien organisiert:
1. **LAYOUT CONTAINER** - Flex/Grid Layouts
2. **FILTER KOMPONENTEN** - Filter-spezifische Elemente
3. **TEXT & TYPOGRAFIE** - Text-Styling

Neue Klassen immer in passende Kategorie einsortieren + Kommentar hinzufügen.
Siehe `src/app.css` Header für Details.

## Error Handling
Siehe: [ERROR_HANDLING.md](../ERROR_HANDLING.md)
- Nutze `error()` aus `@sveltejs/kit`
- Konsistent überall anwenden
- Verweis auf Dokumentation für Pattern
