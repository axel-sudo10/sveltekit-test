<script>
    import { dev } from "$app/environment";
    import BookingSchedule from "../booking/BookingSchedule.svelte";
    import CourseIndicator from "../course/CourseIndicator.svelte";
    import BookingButton from "../booking/BookingButton.svelte";

    let {
        product,
        bookings,
        courseBookings = {},
        locationResources,
    } = $props();

    // Hilfsfunktion: Deutsche Übersetzung holen (oder erste verfügbare)
    const getGermanTranslation = (translations) =>
        translations?.find((t) => t.language === "de") || translations?.[0];

    // Hilfsfunktion: HTML extrahieren und bereinigen (optimiert - single pass)
    const extractText = (html) => {
        if (!html) return "";
        return html
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;|&#?\w+;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    // Prüft ob es ein Kurs ist
    const isCourse = $derived(product?.isCourse === true);

    // Prüft ob Courses vorhanden sind
    const hasCourses = $derived(product?.courses?.length > 0);

    // Bild-URL (reaktiv)
    const imageUrl = $derived.by(() => {
        const doc = product.documents?.[0];
        if (doc?.path) {
            return `https://storage.googleapis.com/static.production.regensburg.delcom.nl/${doc.path}`;
        }
        //TODO element img sollte schon den platz des bildes im html einnehmen damit andere elemente nicht nachrücken wenn das bild reinläd
        if (dev) {
            console.warn("❌ Kein Bild verfügbar - Fallback wird verwendet", {
                hasDocuments: !!product.documents,
                documentsLength: product.documents?.length || 0,
                firstDocument: product.documents?.[0],
            });
        }
        return "https://placehold.co/664x323";
    });

    // Titel (reaktiv, deutsch bevorzugt)
    const title = $derived.by(() => {
        const trans = getGermanTranslation(product.translations);
        return trans?.description || "Keine Beschreibung verfügbar";
    });

    // Beschreibung (reaktiv, deutsch bevorzugt, bereinigt)
    const description = $derived.by(() => {
        const trans = getGermanTranslation(product.translations);
        return extractText(trans?.summary) || "Keine Beschreibung verfügbar";
    });

    // Gültige Subscription-Präfixe
    // TODO: nachfragen wie die SUBSCRIPTION richtig gefiltert werden können, so wie es jetzt ist stimmen sie nicht überein
    const VALID_SUBSCRIPTION_PREFIXES = ["B", "B1", "B2", "B3", "C", "D1"];

    // Hilfsfunktion: Prüft ob Subscription mit gültigem Präfix beginnt
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

    // Eindeutige detaillierte Ortsnamen aus den Buchungen ermitteln
    const uniqueLocationNames = $derived.by(() => {
        if (!locationResources) return [];

        // Alle relevanten Buchungen sammeln (Hauptprodukt + Kurse)
        const allBookings = [
            ...(bookings?.data || []),
            ...Object.values(courseBookings).flatMap((cb) => cb.data || []),
        ];

        // Filter: Nur aktuelle/zukünftige Buchungen berücksichtigen
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeBookings = allBookings.filter((b) => {
            if (!b.startDate) return false;
            const start = new Date(b.startDate);
            return start >= today;
        });

        // Unique linkedProductIds sammeln
        const ids = new Set(
            activeBookings.map((b) => b.productId).filter(Boolean),
        );

        const names = new Set();
        for (const id of ids) {
            const res = locationResources[id];
            if (res) {
                const trans = getGermanTranslation(res.translations);
                const name = trans?.description || res.description;
                if (name) names.add(name);
            }
        }
        return Array.from(names);
    });

    // Hilfsfunktion: Event-Handler für Schließen-Button
    const handleClose = () => {
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
                    {title}
                </h2>
                <!-- Kursanzeige-Komponente -->
                <CourseIndicator {product} />
            </div>

            <img
                src={imageUrl}
                alt={title}
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
            {description}
        </p>

        <!-- ort -->
        {#if product.location && product.location.description}
            <p>
                <strong>Ort:</strong>
                {product.location.description}
                {#if uniqueLocationNames.length > 0}
                    <span class="text-neutral-600">
                        ({uniqueLocationNames.join(", ")})
                    </span>
                {/if}
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
                        {course.translations?.find((t) => t.language === "de")
                            ?.description ||
                            course.translations?.[0]?.description ||
                            course.description ||
                            `Kurs ${course.id}`}
                    </h3>

                    <!-- Flexbox: BookingSchedule links, BookingButton rechts -->
                    <div class="flex flex-wrap items-start gap-4">
                        <div class="flex-1 min-w-[300px]">
                            <BookingSchedule
                                bookings={courseBookings[course.id]}
                                product={course}
                                minDate={course.startDate}
                                maxDate={course.endDate}
                                {locationResources}
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
        <BookingSchedule
            {bookings}
            {product}
            minDate={product.startDate}
            maxDate={product.endDate}
            {locationResources}
        />

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
