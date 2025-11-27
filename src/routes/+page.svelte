<script>
    import FilterMenu from "$lib/components/filterMenu.svelte";
    import ProductList from "$lib/components/productList.svelte"; // Import ProductList

    let subscriptions = [
        "B1 1 Monat Basic",
        "B2 3 Monate Basic",
        "B3 1 Jahr Basic",
    ];

    let categories = ["Bewegungskünste und Turnen", "Denksport", "Tools"];

    let currentFilters = $state({}); // Changed to $state({})

    function handleFilterChange(filters) {
        currentFilters = filters;
    }

    /** @type {import('./$types').PageData} */
    let { data } = $props(); // Reverted to $props()
</script>

// named parameters oder Parameters opbject
<FilterMenu {subscriptions} {categories} onFilterChange={handleFilterChange} />

<p>Current filters: {JSON.stringify(currentFilters)}</p>

{#if // TODO ausgabe der API Antwort per Streaming hier schon gegeben?
data.products}
    <ProductList products={data.products} />
{:else}
    <p>Loading products...</p>
{/if}
