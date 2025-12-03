<script>
    import favicon from "$lib/assets/favicon.svg";
    import "../app.css";

    import FilterMenu from "$lib/components/filter/FilterMenu.svelte";

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

    let { children } = $props();
</script>

<p>Current filters: {JSON.stringify(currentFilters)}</p>

<FilterMenu {subscriptions} {categories} onFilterChange={handleFilterChange} />

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
