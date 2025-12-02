<script>
    let { product } = $props();
</script>

<a href="/veranstaltungen/{product.id}" class="filterSlots">
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
            {product.translations && product.translations.length > 0
                ? product.translations[0].description
                : "No description available"}
        </p>
        <p>
            <strong>Location:</strong>
            {product.location
                ? product.location.description
                : "No location available"}
        </p>
    </div>
</a>
