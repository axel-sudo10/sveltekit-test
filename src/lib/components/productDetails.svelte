<script>
    import BookingSchedule from "./BookingSchedule.svelte";

    let { product, bookings } = $props();

    // Hilfsfunktion: Erstes Bild aus documents holen
    const getImageUrl = (product) => {
        if (product.documents?.length > 0 && product.documents[0]?.path) {
            const baseUrl =
                "https://storage.googleapis.com/static.production.regensburg.delcom.nl/";
            return baseUrl + product.documents[0].path;
        }

        console.warn("❌ Kein Bild verfügbar - Fallback wird verwendet", {
            hasDocuments: !!product.documents,
            documentsLength: product.documents?.length || 0,
            firstDocument: product.documents?.[0],
        });
        return "https://placehold.co/664x323";
    };

    // HTML extrahieren und bereinigen (optimiert - single pass)
    const extractText = (html) => {
        if (!html) return "";

        return html
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;|&#?\w+;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    // Titel aus translations.description holen
    const getTitle = (product) => {
        if (product.translations?.length > 0) {
            return (
                product.translations[0].description ||
                "Keine Beschreibung verfügbar"
            );
        }
        return "Keine Beschreibung verfügbar";
    };

    // Beschreibung aus translations.summary holen (bereinigt)
    const getDescription = (product) => {
        if (product.translations?.length > 0) {
            const summary = product.translations[0].summary;
            const text = extractText(summary);
            return text || "Keine Beschreibung verfügbar";
        }
        return "Keine Beschreibung verfügbar";
    };

    // Gültige Subscription-Präfixe
    const VALID_SUBSCRIPTION_PREFIXES = ["B", "B1", "B2", "B3", "C", "D1"];

    // Prüft ob Subscription mit gültigem Präfix beginnt
    const isValidSubscription = (description) => {
        if (!description || typeof description !== "string") {
            return false;
        }
        return VALID_SUBSCRIPTION_PREFIXES.some((prefix) =>
            description.startsWith(prefix),
        );
    };

    // Reaktiv gefilterte Subscriptions
    const filteredSubscriptions = $derived(
        product.linkedSubscriptions?.filter((sub) =>
            isValidSubscription(sub.description),
        ) ?? [],
    );

    // Event-Handler für Buttons
    const handleClose = () => {
        // TODO: Navigation zurück oder Modal schließen
        window.history.back();
    };

    const handleBook = () => {
        // TODO: Buchungslogik implementieren
        console.log("Buchen:", product.id);
    };
</script>

<div
    class="relative p-6 sm:p-10 lg:p-16 rounded-3xl shadow-md flex flex-col gap-6"
>
    <!-- 2-spaltiger Bereich, mobil untereinander -->
    <div class="flex flex-col md:flex-row md:gap-8 gap-6 flex-wrap">
        <!-- Linke Spalte -->
        <div class="flex-1 min-w-[280px] md:min-w-[400px] flex flex-col gap-4">
            <!-- titel -->
            <h2 class="text-base sm:text-lg font-medium text-black">
                {getTitle(product)}
            </h2>

            <img
                src={getImageUrl(product)}
                alt={getDescription(product)}
                class="w-full h-auto rounded-xl object-cover"
            />
        </div>

        <!-- Rechte Spalte -->
        <div class="flex-1 min-w-[250px] flex flex-col gap-8">
            <!-- Voraussetzung -->
            {#if filteredSubscriptions.length > 0}
                <div class="flex flex-col gap-4">
                    <h3>Voraussetzung:</h3>

                    <div class="flex-gap-container">
                        {#each filteredSubscriptions as subscription, i (i)}
                            <div class="flex items-center gap-2">
                                <div
                                    class="w-8 h-8 border-2 border-black rounded-sm"
                                ></div>
                                <span class="text-sm sm:text-base text-black">
                                    {subscription.description || "Unbekannt"}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {:else}
                <p class="sub_text">Keine Voraussetzungen erforderlich</p>
            {/if}
        </div>
    </div>

    <!-- Textbeschreibung -->
    <div class="text-base text-black leading-relaxed space-y-4">
        <p>
            {getDescription(product)}
        </p>

        <!-- ort -->
        {#if product.location && product.location.description}
            <p>
                <strong>Ort:</strong>
                {product.location.description}
            </p>
        {/if}

        {#if product.startDate}
            <p>
                <strong>Startdatum:</strong>
                {product.startDate}
            </p>
        {/if}

        {#if product.slotMinuts}
            <p>
                <strong>Dauer:</strong>
                {product.slotMinuts} Minuten
            </p>
        {/if}
    </div>

    <!-- Footer -->

    <!-- bookings mit Pagination -->
    <BookingSchedule {bookings} />

    <div class="flex justify-between items-center w-full mt-4">
        <button
            onclick={handleClose}
            class="px-4 py-2 rounded-md text-primary hover:bg-gray-100 transition-colors"
        >
            Schließen
        </button>

        <button
            onclick={handleBook}
            class="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
        >
            Buchen
        </button>
    </div>

    <!-- Close Icon -->
    <button
        onclick={handleClose}
        class="absolute top-6 right-6 w-8 h-8 bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors flex items-center justify-center text-white"
        aria-label="Schließen"
    >
        ×
    </button>
</div>
