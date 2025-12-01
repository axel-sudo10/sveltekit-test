<script>
    let { product } = $props();
</script>

<a href="/veranstaltungen/{product.id}" class="filterSlots">
    <div class="font-bold text-lg border-b border-gray-600 pb-2">
        Product ID: {product.id}
    </div>
    <div class="text-sm">
        <p><strong>Start Date:</strong> {product.startDate || "N/A"}</p>
        <p><strong>Slot Minutes:</strong> {product.slotMinuts || "N/A"}</p>
    </div>
    <div class="text-sm mt-2">
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
