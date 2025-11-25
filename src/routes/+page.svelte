<script>
    import FilterMenu from "$lib/components/filterMenu.svelte";

    let subscriptions = [
        "B1 1 Monat Basic",
        "B2 3 Monate Basic",
        "B3 1 Jahr Basic",
    ];

    let categories = ["Bewegungskünste und Turnen", "Denksport", "Tools"];

    let currentFilters = {};

    function handleFilterChange(filters) {
        currentFilters = filters;
    }

    /** @type {import('./$types').PageProps} */
    let { data } = $props();

    // API-Daten aus load verfügbar
    $effect(() => {
        console.log("Produkte von API:", data.item);
    });
</script>

<FilterMenu {subscriptions} {categories} onFilterChange={handleFilterChange} />

<p>Current filters: {JSON.stringify(currentFilters)}</p>
