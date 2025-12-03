# Filter Best Practices

Zusammenfassung wie Filter in diesem SvelteKit Projekt optimal erstellt werden.

## 1. Datenstruktur & Präfixe

Gültige Werte in **Konstanten Array** definieren. Array am Anfang der Script-Section, kommentiert.

```javascript
// Gültige Präfixe/Werte für Filter
const VALID_SUBSCRIPTION_PREFIXES = ['B', 'B1', 'B2', 'B3', 'C', 'D1'];
```

## 2. Helper-Funktion erstellen

Separate Validierungsfunktion schreiben mit:
- Null-Safety Prüfung (`if (!value || typeof value !== 'string')`)
- `.some()` mit `.startsWith()` für flexible Prefix-Prüfung

```javascript
const isValidSubscription = (description) => {
    if (!description || typeof description !== 'string') {
        return false;
    }
    return VALID_SUBSCRIPTION_PREFIXES.some(prefix => 
        description.startsWith(prefix)
    );
};
```

## 3. Svelte 5 Runes Mode - `$derived`

Reaktive gefilterte Arrays mit `$derived` (nicht `$:`):
- Immutable: `.filter()` ohne Array-Mutationen
- Null-Coalescing `??` für Fallback (leeres Array)

```javascript
const filteredSubscriptions = $derived(
    product.linkedSubscriptions?.filter((sub) =>
        isValidSubscription(sub.description)
    ) ?? []
);
```

**Wichtig:** In Svelte 5 Runes Mode ist `$:` **verboten**! Immer `$derived` verwenden.

## 4. Template - Bedingte Anzeige

- `{#if filteredSubscriptions.length > 0}` für Daten-Check
- `{:else}` Fallback-Message für keine Ergebnisse
- Neue CSS Klassen nutzen (`.flex-gap-container`, `.sub_text`)

```svelte
{#if filteredSubscriptions.length > 0}
    <div class="flex flex-col gap-4">
        <h3>Voraussetzung:</h3>
        <div class="flex-gap-container">
            {#each filteredSubscriptions as subscription, i (i)}
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 border-2 border-black rounded-sm"></div>
                    <span class="text-sm sm:text-base text-black">
                        {subscription.description || "Unbekannt"}
                    </span>
                </div>
            {/each}
        </div>
    </div>
{:else}
    <p class="sub_text">Keine Voraussetzungen erforderlich</p>
{/if}
```

## 5. CSS Integration

- Fertige Klassen aus `src/app.css` nutzen
- Keine Inline-Styles, alles über Tailwind Klassen
- Bei neuen Klassen → `src/app.css` mit `@apply` hinzufügen (in passende Kategorie!)
- CSS Klassen sind organisiert in: LAYOUT CONTAINER, FILTER KOMPONENTEN, TEXT & TYPOGRAFIE

Siehe: `src/app.css` Header

## 6. Error Handling Pattern

- Immer Optional Chaining `?.` nutzen für sichere Daten-Zugriffe
- Nullish Coalescing `??` für Fallback-Werte
- Type-Checks in Helper-Funktionen

```javascript
// Sicher
product.linkedSubscriptions?.filter(...)

// Mit Fallback
linkedSubscriptions ?? []

// Type-Check
typeof description !== 'string'
```

## 7. Keine Mutationen!

Immer immutable arbeiten:
- ✅ `.filter()` - neue Array ohne gefilterte Items
- ✅ `.map()` - neue Array mit transformierten Items
- ❌ `.push()` - mutiert bestehende Array
- ❌ `.splice()` - mutiert bestehende Array

---

## Zusammenfassung

**Ablauf beim Filter erstellen:**

1. Const → Gültige Werte in Array definieren
2. Helper → Validierungsfunktion schreiben
3. $derived → Reaktive gefilterte Array
4. Svelte Template → Mit Bedingungen & Loop rendern
5. CSS-Klassen → Aus `src/app.css` nutzen

**Golden Rule:** Const → Helper → $derived → Svelte Template → CSS-Klassen

---

**Beispiel aus productDetails.svelte:**
- VALID_SUBSCRIPTION_PREFIXES Array
- isValidSubscription() Helper
- filteredSubscriptions $derived
- Template mit {#if} & {#each}
- CSS: `.flex-gap-container`, `.sub_text`, `h3`

Siehe: `src/lib/components/productDetails.svelte` für komplettes Beispiel.
