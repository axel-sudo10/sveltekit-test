<script>
    import ProductDetails from "$lib/components/productDetails.svelte";

    let { data } = $props();
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Veranstaltungsdetails</h1>

    {#if data.product}
        <ProductDetails product={data.product} />
    {:else}
        <p>Keine Produktdaten verfügbar.</p>
    {/if}
</div>
