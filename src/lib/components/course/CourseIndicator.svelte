<script>
    let { product } = $props();

    // Prüft ob es ein Kurs ist
    const isCourse = $derived(product?.isCourse === true);
</script>

{#if isCourse}
    <h2 class="text-base sm:text-lg font-extrabold text-black">
        Kurs
    </h2>
{/if}
