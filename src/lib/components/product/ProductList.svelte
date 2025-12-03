<script>
    import ProductSlot from "./ProductSlot.svelte";

    // Typnecshreibung JSDoc konform besser darstellen
    /**
     * @typedef {object} Product
     * @property {number} id
     * @property {string} [startDate]
     * @property {number} [slotMinuts]
     * @property {Array<{description: string}>} [translations]
     * @property {{description: string}} [location]
     * @property {string} [description]
     * @property {number} [price]
     * @property {boolean} [isCourse]
     * // Add other properties as needed based on the API response
     */

    /**
     * @type {Product[]}
     */
    let { products } = $props(); // Changed to $props()
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 p-8">
    {#each products as product (product.id)}
        <ProductSlot {product} />
    {:else}
        <p>No products available.</p>
    {/each}
</div>

<style>
    /* Component-specific styles here */
</style>
