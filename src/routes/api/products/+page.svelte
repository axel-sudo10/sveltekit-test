<script>
    /** @type {import('./$types').PageProps} */
    let { data } = $props();
</script>

<pre>{JSON.stringify(data.products, null, 2)}</pre>
