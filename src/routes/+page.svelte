<script>
    import ProductList from "$lib/components/productList.svelte";
    /** @type {import('./$types').PageProps} */
    let { data } = $props();
</script>

<section>
    <h2>Produkte</h2>
    {#if data.products && data.products.length > 0}
        <ProductList products={data.products} />
    {:else}
        <p>Keine Produkte verfügbar</p>
    {/if}
</section>
