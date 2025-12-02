<script>
    import ProductDetails from "$lib/components/productDetails.svelte";

    let { data } = $props();
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Veranstaltungsdetails</h1>

    {#await Promise.all([data.product, data.bookings])}
        <div class="h-48 bg-gray-200 rounded animate-pulse"></div>
        <p class="text-gray-500">Loading event details...</p>
    {:then [product, bookings]}
        <ProductDetails {product} {bookings} />
    {/await}
</div>
