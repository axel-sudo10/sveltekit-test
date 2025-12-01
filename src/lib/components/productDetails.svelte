<script>
    let { product } = $props();

    // Hilfsfunktion: Erstes Bild aus documents holen
    const getImageUrl = (product) => {
        if (
            product.documents &&
            product.documents.length > 0 &&
            product.documents[0].path
        ) {
            // TODO: Prüfen ob Base-URL benötigt wird
            return product.documents[0].path;
        }
        return "https://placehold.co/664x323";
    };

    // Beschreibung aus translations holen
    const getDescription = (product) => {
        if (product.translations && product.translations.length > 0) {
            return (
                product.translations[0].description ||
                "Keine Beschreibung verfügbar"
            );
        }
        return "Keine Beschreibung verfügbar";
    };

    // TODO: Zeitbereiche aus API-Daten mappen
    // Aktuell nicht in der API-Response sichtbar - placeholder Daten
    const morningHours = [
        { day: "Mo", time: "07:30 - 10:00" },
        { day: "Di", time: "07:30 - 10:00" },
        { day: "Mi", time: "07:30 - 10:00" },
        { day: "Do", time: "07:30 - 10:00" },
        { day: "Fr", time: "07:30 - 10:00" },
        { day: "Sa", time: "09:00 - 16:30" },
    ];

    const afternoonHours = [
        { day: "Mo", time: "14:00 - 21:45" },
        { day: "Di", time: "14:00 - 21:45" },
        { day: "Mi", time: "14:00 - 21:45" },
        { day: "Do", time: "14:00 - 21:45" },
        { day: "Fr", time: "14:00 - 20:15" },
    ];

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
    class="relative w-full h-full p-6 sm:p-10 lg:p-16 rounded-3xl shadow-md flex flex-col gap-6"
>
    <!-- 2-spaltiger Bereich, mobil untereinander -->
    <div class="flex flex-col md:flex-row md:gap-8 gap-6 flex-wrap">
        <!-- Linke Spalte -->
        <div class="flex-1 min-w-[280px] md:min-w-[400px] flex flex-col gap-4">
            <h2 class="text-base sm:text-lg font-medium text-black">
                {getDescription(product)}
            </h2>

            <img
                src={getImageUrl(product)}
                alt={getDescription(product)}
                class="w-full h-auto rounded-xl object-cover"
            />
        </div>

        <!-- Rechte Spalte -->
        <div class="flex-1 min-w-[250px] flex flex-col gap-8">
            <!-- Verfügbar für -->
            {#if product.linkedSubscriptions && product.linkedSubscriptions.length > 0}
                <div class="flex flex-col gap-4">
                    <h3 class="text-lg font-medium text-black">
                        Verfügbar für:
                    </h3>

                    <div class="flex flex-wrap gap-4">
                        {#each product.linkedSubscriptions as subscription, i (i)}
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
            {/if}

            <!-- Zeitbereiche -->
            <!-- TODO: Diese Daten aus der API holen, wenn verfügbar -->
            <div class="flex flex-wrap gap-8">
                <!-- Vormittags -->
                <div class="flex flex-col gap-4 max-w-[350px]">
                    <h4 class="text-primary text-base font-medium">
                        Vormittags
                    </h4>

                    <div class="grid grid-cols-2 gap-3">
                        {#each morningHours as slot (slot.day)}
                            <span>{slot.day}: {slot.time}</span>
                        {/each}
                    </div>
                </div>

                <!-- Nachmittags -->
                <div class="flex flex-col gap-4 max-w-[350px]">
                    <h4 class="text-black text-base font-medium">
                        Nachmittags
                    </h4>

                    <div class="grid grid-cols-2 gap-3">
                        {#each afternoonHours as slot (slot.day)}
                            <span>{slot.day}: {slot.time}</span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Textbeschreibung -->
    <div class="text-base text-black leading-relaxed space-y-4">
        <p>
            {getDescription(product)}
        </p>

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
