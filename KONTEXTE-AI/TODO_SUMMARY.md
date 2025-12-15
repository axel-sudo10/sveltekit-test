# Zusammenfassung der TODO-Kommentare

Hier ist eine Zusammenfassung aller `TODO`-Kommentare, die im Projekt gefunden wurden:

## API & Daten-Fetching

- **Subscriptions & Kategorien laden**: In `src/routes/+layout.svelte`, `src/routes/+page.js` und `src/routes/stundenplan/+page.js` gibt es mehrere Hinweise darauf, dass die Beispieldaten für Abonnements (Subscriptions) und Kategorien durch echte API-Aufrufe (fetch) ersetzt werden müssen.

## Komponenten & UI

- **`ProductDetails.svelte`**:
    - Das `<img>`-Element sollte so implementiert werden, dass es den Platz für das Bild vor dem Laden reserviert, um ein Verschieben des Layouts (Layout Shift) zu verhindern.
    - Die Logik zum Filtern von `SUBSCRIPTION` muss geklärt und korrigiert werden, da sie aktuell nicht korrekt funktioniert.
    - Es muss eine Funktion für die "Zurück"-Navigation oder zum Schließen eines Modals implementiert werden. Frage?

- **`BookingButton.svelte`**:
    - Die Logik, die bestimmt, wann ein Produkt buchbar ist, muss genauer definiert und überarbeitet werden.
    - Die Generierung von `.ics`-Kalenderdateien muss korrigiert werden, damit sie funktionierende und sinnvolle Daten ausgibt.
