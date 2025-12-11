<script>
    let { product } = $props();

    // ICS-Datei für Kalender generieren (Dummy)
    // TODO: überarbeiten so das sinvolle und funktionirende ics ausgegeben werden
    // const generateICSFile = () => {
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

    //     const blob = new Blob([icsContent], { type: "text/calendar" });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = `${product.id}-event.ics`;
    //     a.click();
    //     URL.revokeObjectURL(url);
    // };

    // Kurs-Buchungs-URL generieren
    const getCourseUrl = () => {
        if (!product?.id) {
            console.warn("⚠️ Product ID fehlt - Kurs-Buchung nicht möglich");
            return null;
        }
        return `https://ur-sport.de/shop/courses/${product.id}`;
    };

    const courseUrl = getCourseUrl();

    // Warnung ausgeben falls keine URL
    if (!courseUrl) {
        console.warn("⚠️ BookingButton: Keine gültige Kurs-URL", { product });
    }
</script>

{#if courseUrl}
    <a
        href={courseUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="px-6 py-2 rounded-md bg-gray-500 text-white hover:bg-primary/90 transition-colors"
    >
        Buchen
    </a>
{/if}
