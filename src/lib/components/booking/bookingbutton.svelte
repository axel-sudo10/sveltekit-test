<script>
    let { product, booking, class: className = "" } = $props();

    // ICS-Datei für Kalender generieren (Dummy)
    // TODO: alle eventualitäten finden indenen keine buchung möglich ist und dann den button ausblenden
    // zb: kursvoll, kurs ist offen, kursfindet noch garnicht stadt
    // TODO: überarbeiten so das sinvolle und funktionirende ics ausgegeben werden
    // const generateICSFile = () => {
    const icsContent = product ? `BEGIN:VCALENDAR
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
END:VCALENDAR` : null;

    //     const blob = new Blob([icsContent], { type: "text/calendar" });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = `${product.id}-event.ics`;
    //     a.click();
    //     URL.revokeObjectURL(url);
    // };

    // Validierung und URL-Generierung für Produkte
    const getProductBookingUrl = () => {
        if (!product) {
            console.warn("⚠️ BookingButton: Kein Produkt übergeben");
            return null;
        }

        if (!product.id) {
            console.warn("⚠️ BookingButton: Product ID fehlt", { product });
            return null;
        }

        return `https://ur-sport.de/shop/courses/${product.id}`;
    };

    // Validierung und URL-Generierung für einzelne Buchungslots
    const getSlotBookingUrl = () => {
        if (!booking?.uuid) {
            console.warn("⚠️ BookingButton: Booking UUID fehlt", { bookingId: booking?.id });
            return null;
        }
        return `https://consumer-frontend.production.regensburg.delcom.nl/bookings/${booking.uuid}`;
    };

    const url = booking ? getSlotBookingUrl() : getProductBookingUrl();
    const buttonText = booking ? "zum Termin" : "zum Termin";
    const defaultClass = booking ? "px-2 py-1 text-xs" : "px-6 py-2 rounded-md";
</script>

{#if url}
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        class="{defaultClass} bg-gray-500 text-white hover:bg-primary/90 transition-colors {className}"
    >
        {buttonText}
    </a>
{:else}
    {#if booking}
        <span class="px-2 py-1 text-xs text-center">
            Kein Termin
        </span>
    {/if}
{/if}
