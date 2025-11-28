<script>
    import FilterMenu from "$lib/components/filterMenu.svelte";
    import ProductList from "$lib/components/productList.svelte";

    let subscriptions = [
        "B1 1 Monat Basic",
        "B2 3 Monate Basic",
        "B3 1 Jahr Basic",
    ]; //TODO: beispielabonnements sollen mit API geladen werden werden fetch subscriptions

    let categories = ["Bewegungskünste und Turnen", "Denksport", "Tools"];
    // TODO: beispielkategorien sollen mit API geladen werden werden fetch categories

    let currentFilters = $state({});

    function handleFilterChange(filters) {
        currentFilters = filters;
    }

    /** @type {import('./$types').PageProps} */
    let { data } = $props();
</script>

<FilterMenu {subscriptions} {categories} onFilterChange={handleFilterChange} />

<p>Current filters: {JSON.stringify(currentFilters)}</p>

<section>
    <h2>Produkte</h2>
    {#if data.products && data.products.length > 0}
        <ProductList products={data.products} />
    {:else}
        <p>Keine Produkte verfügbar</p>
    {/if}
</section>
