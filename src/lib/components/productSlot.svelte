<script>
    let { product } = $props();

    // Holt die deutsche Beschreibung aus translations
    const getGermanDescription = (translations) => {
        if (!translations || translations.length === 0) {
            return "No description available";
        }
        const germanTranslation = translations.find((t) => t.language === "de");
        return germanTranslation?.description || "No description available";
    };
</script>

<a href="/veranstaltung/{product.id}" class="filterSlots">
    <div>
        Product ID: {product.id}
    </div>
    <div>
        <!-- kommen aus den bookings daher werden startDate nicht angezeigt -->
        <p><strong>Start Date:</strong> {product.startDate || "N/A"}</p>
        <p><strong>Slot Minutes:</strong> {product.slotMinutes || "N/A"}</p>
    </div>
    <div>
        <p>
            <strong>Description:</strong>
            {getGermanDescription(product.translations)}
        </p>
        <p>
            <strong>Location:</strong>
            {product.location
                ? product.location.description
                : "No location available"}
        </p>
    </div>
</a>
