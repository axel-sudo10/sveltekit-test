<script>
    import { base } from "$app/paths";
    import CourseIndicator from "../course/CourseIndicator.svelte";

    let { product, page = "detail" } = $props();

    // Hilfsfunktion: Erstes Bild aus documents holen
    const getImageUrl = (product) => {
        if (product.documents?.length > 0 && product.documents[0]?.path) {
            const baseUrl =
                "https://storage.googleapis.com/static.production.regensburg.delcom.nl/";
            const fullUrl = baseUrl + product.documents[0].path;
            // console.log("🎨 Image loaded:", product.id, fullUrl);
            return fullUrl;
        }
        console.warn("⚠️ No image for product:", product.id);
        return null;
    };

    // Holt die deutsche Beschreibung aus translations
    const getGermanDescription = (product) => {
        const { translations, id } = product;
        if (!translations?.length) {
            console.warn("⚠️ No translations available for product:", id);
            return "No description available";
        }

        const germanTranslation = translations.find((t) => t.language === "de");
        if (germanTranslation?.description) {
            return germanTranslation.description;
        }

        console.warn(
            `⚠️ No German translation found for product: ${id}. Available:`,
            translations.map((t) => t.language),
        );
        return "No description available";
    };

    // Hilfsfunktion: Titel holen
    const getTitle = (product) => {
        if (product.translations?.length > 0) {
            return (
                product.translations[0].description ||
                "Keine Beschreibung verfügbar"
            );
        }
        return "Keine Beschreibung verfügbar";
    };

    const imageUrl = $derived(getImageUrl(product));
</script>

{#if page === "home"}
    <!-- HOME STATE: Nur Bild mit CourseIndicator und Product ID -->
    <a
        href="{base}/veranstaltung/{product.id}"
        style="position: relative; height: 250px;"
    >
        {#if imageUrl}
            <img
                src={imageUrl}
                alt={getTitle(product)}
                style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem; z-index: 0;"
                loading="lazy"
            />
        {/if}
        <div
            class="productSlotHomeContent"
            style="position: relative; z-index: 10;"
        >
            <div class="productSlotCourseTop">
                <CourseIndicator {product} />
            </div>
            <div>
                <p class="text-white text-sm">
                    {getGermanDescription(product)}
                </p>
            </div>
            <div class="productSlotProductIdBottom">
                Product ID: {product.id}
            </div>
        </div>
    </a>
{:else}
    <!-- DETAIL STATE: Vollständiges Layout mit Bild oben -->
    <a
        href="{base}/veranstaltung/{product.id}"
        data-sveltekit-preload-data="tap"
        class="filterSlots"
    >
        <!-- Kursinformation und Product ID -->
        <div class="flex gap-2">
            <div>
                <!-- nur für entwicklung relevant -->
                Product ID: {product.id}
            </div>
            <CourseIndicator {product} />
        </div>

        <!-- Start Date und Slot Minutes -->
        <div>
            <p><strong>Start Date:</strong> {product.startDate || "N/A"}</p>
            <p><strong>Slot Minutes:</strong> {product.slotMinutes || "N/A"}</p>
        </div>

        <!-- Description und Location -->
        <div>
            <p>
                <strong>Description:</strong>
                {getGermanDescription(product)}
            </p>
            <p>
                <strong>Location:</strong>
                {product.location
                    ? product.location.description
                    : "No location available"}
            </p>
        </div>
        <!-- Bild -->
        {#if imageUrl}
            <img
                src={imageUrl}
                alt={getGermanDescription(product)}
                class="w-full h-48 rounded-lg object-cover"
            />
        {/if}
    </a>
{/if}
