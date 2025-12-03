<script>
    import { createEventDispatcher } from "svelte";
    export let subscriptions = [];
    export let categories = [];
    export let onFilterChange = (filters) => {};

    let searchQuery = "";
    let activeSubscriptions = [];
    let activeCategories = [];

    const dispatch = createEventDispatcher();

    // Reactive update for parent component
    $: {
        const filters = {
            subscriptions: activeSubscriptions,
            categories: activeCategories,
            search: searchQuery,
        };
        if (onFilterChange) onFilterChange(filters);
    }

    // Popover state management is now handled by the browser via the 'popover' attribute.
    // The 'togglePopover', 'handleOutsideClick', 'activePopover' and 'menuRef' are no longer needed.

    function toggleFilter(list, item) {
        if (list === "abos") {
            if (activeSubscriptions.includes(item)) {
                activeSubscriptions = activeSubscriptions.filter(
                    (i) => i !== item,
                );
            } else {
                activeSubscriptions = [...activeSubscriptions, item];
            }
        } else {
            if (activeCategories.includes(item)) {
                activeCategories = activeCategories.filter((i) => i !== item);
            } else {
                activeCategories = [...activeCategories, item];
            }
        }
    }

    function clearFilters(type) {
        if (type === "abos") activeSubscriptions = [];
        if (type === "kategorien") activeCategories = [];
    }

    // Helper to display text inside the active button (e.g., "Abos | MySub")
    function getLabel(base, activeList) {
        if (activeList.length === 0) return base;
        // Display first item, add (+n) if more
        const first = activeList[0];
        const remainder =
            activeList.length > 1 ? ` (+${activeList.length - 1})` : "";
        return { label: base, value: `${first}${remainder}` };
    }
</script>

<div class="filter-container">
    <div>
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Suchen..."
            class="filter-item"
        />
    </div>

    <!-- Subscriptions Filter -->
    <div>
        {#if activeSubscriptions.length === 0}
            <button popovertarget="popover-abos" class="filter-item">
                Abos
            </button>
        {:else}
            <div>
                <button popovertarget="popover-abos"> Abos </button>
                <div></div>
                <span>{getLabel("Abos", activeSubscriptions).value}</span>
                <button on:click|stopPropagation={() => clearFilters("abos")}>
                    ✕
                </button>
            </div>
        {/if}

        <div id="popover-abos" popover>
            <div>
                {#each subscriptions as sub}
                    <button on:click={() => toggleFilter("abos", sub)}>
                        <span>{sub}</span>
                        {#if activeSubscriptions.includes(sub)}
                            <span>✓</span>
                        {/if}
                    </button>
                {:else}
                    <div>Keine Optionen</div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Categories Filter -->
    <div class="filter-item">
        {#if activeCategories.length === 0}
            <button popovertarget="popover-kategorien"> Kategorien </button>
        {:else}
            <div>
                <button popovertarget="popover-kategorien"> Kategorien </button>
                <div></div>
                <span>{getLabel("Kategorien", activeCategories).value}</span>
                <button
                    on:click|stopPropagation={() => clearFilters("kategorien")}
                >
                    ✕
                </button>
            </div>
        {/if}

        <div id="popover-kategorien" popover>
            <div>
                {#each categories as cat}
                    <button on:click={() => toggleFilter("kategorien", cat)}>
                        <span>{cat}</span>
                        {#if activeCategories.includes(cat)}
                            <span>✓</span>
                        {/if}
                    </button>
                {:else}
                    <div>Keine Optionen</div>
                {/each}
            </div>
        </div>
    </div>
</div>
