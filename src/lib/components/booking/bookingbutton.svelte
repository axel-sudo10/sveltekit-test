<script>
    let { product, bookings } = $props();

    // Prüft ob maxParticipants null ist (null = zu Kalender hinzufügen, sonst = buchen)
    let isBookable = $derived(bookings.maxParticipants == null);

    console.log("BookingButton - isBookable:", isBookable);

    // ICS-Datei für Kalender generieren (Dummy)
    // TODO: überarbeiten so das sinvolle und funktionirende ics ausgegeben werden
    const generateICSFile = () => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UR-Sport//Product Calendar//EN
BEGIN:VEVENT
UID:${product.id}@ur-sport.de
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${product.startDate?.replace(/[-:]/g, "") || "TBA"}
SUMMARY:${product.translations?.[0]?.description || "UR-Sport Event"}
DESCRIPTION:${product.translations?.[0]?.summary?.replace(/<[^>]*>/g, "") || "No description"}
LOCATION:${product.location?.description || "TBA"}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${product.id}-event.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Link zur Buchungsseite
    const bookingUrl = `https://ur-sport.de/shop/products/${product.id}`;
</script>

{#if isBookable}
    <button
        onclick={generateICSFile}
        class="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
    >
        Zu Kalender hinzufügen
    </button>
{:else}
    <a
        href={bookingUrl}
        class="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
    >
        Buchen
    </a>
{/if}
