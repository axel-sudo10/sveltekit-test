# Error Handling Guide

## Prinzipien

1. **Nutze `error()` aus `@sveltejs/kit`** - nicht try-catch
2. **HTTP-Status Code setzen** - für Browser-Error-Pages
3. **Aussagekräftige Meldungen** - für Debugging
4. **Konsistent überall** - +server.js, +page.js, +page.server.js, ...

---

## Pattern

### In Load-Funktionen (+page.js, +page.server.js)

```javascript
import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
  const res = await fetch("/api/products");
  
  if (!res.ok) {
    error(res.status, "Fehlermeldung");
  }
  
  return { /* data */ };
}
```

### In API-Endpoints (+server.js)
specifisch für +server.js dateien
```javascript
import { error, json } from "@sveltejs/kit";

export async function GET({ fetch }) {
  const res = await fetch("https://external-api.com");
  
  if (!res.ok) {
    error(res.status, "Failed to fetch from external API");
  }
  
  return json(await res.json());
}
```

---

## Error-Page

SvelteKit rendert automatisch `+error.svelte` wenn `error()` aufgerufen wird.

Beispiel: `src/routes/+error.svelte`
```svelte
<script>
  import { page } from '$app/state';
</script>

<h1>{page.status}</h1>
<p>{page.error?.message}</p>
```
