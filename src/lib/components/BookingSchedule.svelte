<script>
    let { bookings } = $props();

    // Debug
    $effect(() => {
        console.log("📅 BookingSchedule received bookings:", bookings);
    });

    // Extract actual booking array from API response
    let bookingsArray = $derived(
        bookings && Array.isArray(bookings.data) ? bookings.data : [],
    );

    // State
    let currentWeekIndex = $state(0);

    // Helper: Montag der Woche ermitteln
    const getMonday = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    // Helper: Tage addieren
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Bookings in Wochen gruppieren
    const getWeeksFromBookings = (bookings) => {
        const weeksMap = new Map();

        if (!bookings || !Array.isArray(bookings)) {
            return [];
        }

        bookings.forEach((booking) => {
            const date = new Date(booking.startDate);
            const monday = getMonday(date);
            const weekKey = monday.toISOString().split("T")[0];

            if (!weeksMap.has(weekKey)) {
                weeksMap.set(weekKey, {
                    weekStart: monday,
                    weekEnd: addDays(monday, 6),
                    bookings: [],
                });
            }

            weeksMap.get(weekKey).bookings.push(booking);
        });

        return Array.from(weeksMap.values()).sort(
            (a, b) => a.weekStart - b.weekStart,
        );
    };

    // Bookings nach Tageszeit trennen
    const splitByTimeOfDay = (bookings) => {
        const morning = [];
        const afternoon = [];

        bookings.forEach((booking) => {
            const hour = new Date(booking.startDate).getHours();
            if (hour < 12) {
                morning.push(booking);
            } else {
                afternoon.push(booking);
            }
        });

        // Chronologisch sortieren
        morning.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        afternoon.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        return { morning, afternoon };
    };

    // Derived states
    let weeks = $derived(getWeeksFromBookings(bookingsArray));

    // Bei Änderung der Wochen: auf aktuelle Woche setzen
    $effect(() => {
        if (weeks.length > 0) {
            const today = new Date();
            const currentMonday = getMonday(today);
            const currentIndex = weeks.findIndex(
                (week) =>
                    week.weekStart.toDateString() ===
                    currentMonday.toDateString(),
            );
            currentWeekIndex = currentIndex >= 0 ? currentIndex : 0;
        }
    });

    let currentWeek = $derived(weeks[currentWeekIndex] || null);
    let { morning, afternoon } = $derived(
        currentWeek
            ? splitByTimeOfDay(currentWeek.bookings)
            : { morning: [], afternoon: [] },
    );

    let canGoPrevious = $derived(currentWeekIndex > 0);
    let canGoNext = $derived(currentWeekIndex < weeks.length - 1);

    // Navigation
    const goToPreviousWeek = () => {
        if (canGoPrevious) currentWeekIndex--;
    };

    const goToNextWeek = () => {
        if (canGoNext) currentWeekIndex++;
    };

    // Formatierung
    const formatWeekLabel = (week) => {
        const start = week.weekStart.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
        });
        const end = week.weekEnd.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        return `Woche vom ${start} - ${end}`;
    };

    const formatBooking = (booking) => {
        const date = new Date(booking.startDate);
        const dayName = date.toLocaleDateString("de-DE", { weekday: "short" });
        const dateStr = date.toLocaleDateString("de-DE");
        const startTime = date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const endTime = new Date(booking.endDate).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const available = booking.availableParticipantCount > 0;

        return { dayName, dateStr, startTime, endTime, available };
    };
</script>

<div class="space-y-4">
    <!-- Header mit Navigation -->
    <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
        <h3 class="text-lg font-semibold">
            {currentWeek ? formatWeekLabel(currentWeek) : "Keine Buchungen"}
        </h3>

        <div class="flex gap-2 self-end sm:self-auto">
            <button
                onclick={goToPreviousWeek}
                disabled={!canGoPrevious}
                class="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                aria-label="Zur vorherigen Woche"
            >
                ← Vorherige
            </button>

            <button
                onclick={goToNextWeek}
                disabled={!canGoNext}
                class="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                aria-label="Zur nächsten Woche"
            >
                Nächste →
            </button>
        </div>
    </div>

    <!-- Two-Column Layout (Mobile: übereinander) -->
    {#if currentWeek}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <!-- Vormittags -->
            <div>
                <h4 class="text-base font-medium text-blue-600 mb-4">
                    Vormittags
                </h4>
                <div class="space-y-3">
                    {#each morning as booking (booking.id)}
                        {@const formatted = formatBooking(booking)}
                        <div
                            class="border-l-4 {formatted.available
                                ? 'border-green-500'
                                : 'border-red-500'} p-4 bg-gray-50 rounded-r"
                        >
                            <div class="flex justify-between items-start mb-2">
                                <p class="font-semibold text-gray-900">
                                    {formatted.dayName}, {formatted.dateStr}
                                </p>
                                <span
                                    class="text-xs {formatted.available
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'} px-2 py-1 rounded whitespace-nowrap"
                                >
                                    {formatted.available ? "✓ Frei" : "✗ Voll"}
                                </span>
                            </div>
                            <p class="text-blue-600 font-medium">
                                {formatted.startTime} - {formatted.endTime} Uhr
                            </p>
                            {#if !formatted.available}
                                <p class="text-xs text-gray-600 mt-2">
                                    ({booking.currentParticipantCount}/{booking.maxParticipants ||
                                        "∞"} Teilnehmer)
                                </p>
                            {/if}
                        </div>
                    {/each}
                    {#if morning.length === 0}
                        <p class="text-sm text-gray-400">Keine Termine</p>
                    {/if}
                </div>
            </div>

            <!-- Nachmittags -->
            <div>
                <h4 class="text-base font-medium text-gray-700 mb-4">
                    Nachmittags
                </h4>
                <div class="space-y-3">
                    {#each afternoon as booking (booking.id)}
                        {@const formatted = formatBooking(booking)}
                        <div
                            class="border-l-4 {formatted.available
                                ? 'border-green-500'
                                : 'border-red-500'} p-4 bg-gray-50 rounded-r"
                        >
                            <div class="flex justify-between items-start mb-2">
                                <p class="font-semibold text-gray-900">
                                    {formatted.dayName}, {formatted.dateStr}
                                </p>
                                <span
                                    class="text-xs {formatted.available
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'} px-2 py-1 rounded whitespace-nowrap"
                                >
                                    {formatted.available ? "✓ Frei" : "✗ Voll"}
                                </span>
                            </div>
                            <p class="text-gray-700 font-medium">
                                {formatted.startTime} - {formatted.endTime} Uhr
                            </p>
                            {#if !formatted.available}
                                <p class="text-xs text-gray-600 mt-2">
                                    ({booking.currentParticipantCount}/{booking.maxParticipants ||
                                        "∞"} Teilnehmer)
                                </p>
                            {/if}
                        </div>
                    {/each}
                    {#if afternoon.length === 0}
                        <p class="text-sm text-gray-400">Keine Termine</p>
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <p class="text-center text-gray-500">Keine Buchungen verfügbar</p>
    {/if}
</div>

<style>
    /* Responsive adjustments */
    @media (max-width: 768px) {
        :global(.space-y-3 > div) {
            width: 100%;
        }
    }
</style>
