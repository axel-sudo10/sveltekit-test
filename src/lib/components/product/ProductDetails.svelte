<script>
    import BookingSchedule from "../booking/BookingSchedule.svelte";
    import CourseIndicator from "../course/CourseIndicator.svelte";
    import BookingButton from "../booking/bookingbutton.svelte";

    let { product, bookings, courseBookings = {} } = $props();

    // Prüft ob es ein Kurs ist
    const isCourse = $derived(product?.isCourse === true);

    // Prüft ob Courses vorhanden sind
    const hasCourses = $derived(product?.courses?.length > 0);

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
        //TODO element img sollte schon den platz des bildes im html einnehmen damit andere elemente nicht nachrücken wenn das bild reinläd
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
    // TODO: nachfragen wie die SUBSCRIPTION richtig gefiltert werden können, so wie es jetzt ist stimmen sie nicht überein
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
</script>

<div
    class="relative p-6 sm:p-10 lg:p-16 rounded-3xl shadow-md flex flex-col gap-6"
>
    <!-- 2-spaltiger Bereich, mobil untereinander -->
    <div class="flex flex-col md:flex-row md:gap-8 gap-6 flex-wrap">
        <!-- Linke Spalte -->
        <div class="flex-1 min-w-[280px] md:min-w-[400px] flex flex-col gap-4">
            <!-- titel un information ob es ein kurs ist -->
            <div class="flex flex-row gap-4">
                <h2 class="text-base sm:text-lg font-medium text-black">
                    {getTitle(product)}
                </h2>
                <!-- Kursanzeige-Komponente -->
                <CourseIndicator {product} />
            </div>

            <img
                src={getImageUrl(product)}
                alt={getTitle(product)}
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

    <!-- Courses mit jeweiligen Bookings anzeigen -->
    {#if hasCourses}
        <div class="flex flex-col gap-6">
            {#each product.courses as course (course.id)}
                <div class="border-t pt-4">
                    <!-- Course Name -->
                    <h3 class="text-base font-medium mb-3">
                        {course.translations?.[0]?.description ||
                            course.description ||
                            `Kurs ${course.id}`}
                    </h3>

                    <!-- Flexbox: BookingSchedule links, BookingButton rechts -->
                    <div class="flex flex-wrap items-start gap-4">
                        <div class="flex-1 min-w-[300px]">
                            <BookingSchedule
                                bookings={courseBookings[course.id]}
                                product={course}
                            />
                        </div>
                        <div class="flex-shrink-0">
                            <BookingButton product={course} />
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <!-- Fallback: Bestehendes Verhalten für einzelnes Product -->
        <BookingSchedule {bookings} {product} />

        <div class="flex justify-between items-center w-full mt-4">
            <button
                onclick={handleClose}
                class="px-4 py-2 rounded-md text-primary hover:bg-gray-100 transition-colors"
            >
                Schließen
            </button>

            {#if isCourse}
                <BookingButton {product} />
            {/if}
        </div>
    {/if}

    <!-- Schließen Button (immer anzeigen wenn Courses vorhanden) -->
    {#if hasCourses}
        <div class="flex justify-start w-full mt-4">
            <button
                onclick={handleClose}
                class="px-4 py-2 rounded-md text-primary hover:bg-gray-100 transition-colors"
            >
                Schließen
            </button>
        </div>
    {/if}

    <!-- Close Icon -->
    <button
        onclick={handleClose}
        class="absolute top-6 right-6 w-8 h-8 bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors flex items-center justify-center text-white"
        aria-label="Schließen"
    >
        ×
    </button>
</div>
