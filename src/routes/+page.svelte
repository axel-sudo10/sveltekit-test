<script>
    import FilterMenu from "$lib/components/filterMenu.svelte";

    let subscriptions = [
        "B1 1 Monat Basic",
        "B2 3 Monate Basic",
        "B3 1 Jahr Basic",
    ]; //diese daten sollen später über eine api anfragen kommen

    let categories = ["Bewegungskünste und Turnen", "Denksport", "Tools"]; //diese daten sollen später über eine api anfragen kommen

    let currentFilters = {};

    function handleFilterChange(filters) {
        currentFilters = filters;
    }
</script>

<FilterMenu {subscriptions} {categories} onFilterChange={handleFilterChange} />

<p>Current filters: {JSON.stringify(currentFilters)}</p>
