<!--
  BookingSchedule Component:
  Displays a paginated list of booking appointments in a flexible, wrapping layout.
  Automatically navigates to the page containing today's or the next upcoming booking on load.
-->
<script>
    // Component Properties
    // `bookings` prop contains the raw booking data fetched from an API.
    // `product` prop contains the product data to determine if it's a course.
    let { bookings, product } = $props();

    // Prüft ob es ein Kurs ist
    const isCourse = $derived(product?.isCourse === true);

    // Booking URL generieren (nur für Produkte, nicht für Kurse)
    const getBookingUrl = (booking) => {
        if (!booking?.uuid) {
            console.warn("⚠️ Booking UUID fehlt", { bookingId: booking?.id });
            return null;
        }
        return `https://consumer-frontend.production.regensburg.delcom.nl/bookings/${booking.uuid}`;
    };

    // Pagination State
    // `pageSize`: Defines how many booking cards are displayed per page.
    const pageSize = 6;
    // `currentPage`: Reactive state ($state) tracking the currently active page.
    let currentPage = $state(1);

    // Derived State: Processed Bookings Array
    // `bookingsArray`: Extracts the actual booking data, sorts it chronologically by startDate.
    // Uses `$derived` to reactively update when the `bookings` prop changes.
    let bookingsArray = $derived(
        bookings && Array.isArray(bookings.data)
            ? [...bookings.data].sort(
                  (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
              )
            : [],
    );

    // Effect: Initialize Current Page to Today's Bookings
    // `$effect` runs once initially and whenever `bookingsArray` changes.
    // It finds the first booking entry that is on or after the current date
    // and sets `currentPage` to the page containing that booking.
    $effect(() => {
        if (bookingsArray.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to the start of the day for date comparison

            // Find the index of the first booking relevant to today or future dates
            const firstRelevantIndex = bookingsArray.findIndex(
                (booking) => new Date(booking.startDate) >= today,
            );

            // If a relevant booking is found, calculate and set the initial page
            if (firstRelevantIndex !== -1) {
                currentPage = Math.floor(firstRelevantIndex / pageSize) + 1;
            }
        }
    });

    // Derived State: Pagination Calculations
    // `totalPages`: Calculates the total number of pages based on `bookingsArray` length and `pageSize`.
    let totalPages = $derived(Math.ceil(bookingsArray.length / pageSize));
    // `paginatedBookings`: Slices `bookingsArray` to get only the bookings for the `currentPage`.
    // Updates reactively when `currentPage` or `bookingsArray` changes.
    let paginatedBookings = $derived(
        bookingsArray.slice(
            (currentPage - 1) * pageSize, // Start index for the current page
            currentPage * pageSize, // End index for the current page
        ),
    );

    // Helper Function: Formats a single booking object for display.
    const formatBooking = (booking) => {
        const date = new Date(booking.startDate);
        const dayName = date.toLocaleDateString("de-DE", { weekday: "long" });
        const dateStr = date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });

        const startTime = date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const endTime = new Date(booking.endDate).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return {
            dayName,
            dateStr,
            timeRange: `${startTime} - ${endTime} Uhr`,
            availableCount: booking.availableParticipantCount ?? 0,
        };
    };
</script>

<!-- Main container for the Booking Schedule component -->
<div>
    <!-- Pagination Controls Section -->
    <!-- `flex justify-between items-center`: Arranges children (buttons, page info) horizontally,
         with space between them and vertically centered. -->
    <div class="flex justify-between items-center mb-4">
        <!-- Previous Page Button -->
        <!-- `onclick`: Decrements `currentPage` to navigate to the previous page. -->
        <!-- `disabled`: Button is disabled if `currentPage` is the first page. -->
        <!-- Tailwind classes: Styling for button appearance and disabled state. -->
        <button
            onclick={() => currentPage--}
            disabled={currentPage === 1}
            class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
            &lt; <!-- Left arrow symbol -->
        </button>

        <!-- Current Page Information -->
        <!-- Displays the current page number and the total number of pages. -->
        <span class="text-sm text-gray-600"
            >Seite {currentPage} von {totalPages}</span
        >

        <!-- Next Page Button -->
        <!-- `onclick`: Increments `currentPage` to navigate to the next page. -->
        <!-- `disabled`: Button is disabled if `currentPage` is the last page. -->
        <button
            onclick={() => currentPage++}
            disabled={currentPage === totalPages}
            class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
            &gt; <!-- Right arrow symbol -->
        </button>
    </div>

    <!-- Booking Cards Display Area -->
    <div class="flex flex-wrap justify-center gap-4 pb-4">
        <!-- Loop through `paginatedBookings` to display each booking card -->
        {#each paginatedBookings as booking (booking.id)}
            {@const formatted = formatBooking(booking)}
            <!-- Individual Booking Card -->
            <div
                class="flex aspect-square w-[6rem] flex-col justify-between bg-gray-50 p-3 pb-6 shadow-md"
            >
                <!-- Card Header: Day Name -->
                <p class="font-medium text-sm">{formatted.dayName}</p>

                <!-- Date Display -->
                <p class="text-xs text-gray-600">{formatted.dateStr}</p>

                <!-- Time Range Display -->
                <p class="text-center text-xs">{formatted.timeRange}</p>

                <!-- Available Participants Display -->
                <p
                    class="text-center text-sm font-medium"
                    class:text-green-600={formatted.availableCount > 0}
                    class:text-red-600={formatted.availableCount === 0}
                >
                    {formatted.availableCount} Plätze
                </p>

                <!-- Buchen Button (nur für Produkte, nicht für Kurse) -->
                {#if !isCourse}
                    {@const bookingUrl = getBookingUrl(booking)}
                    {#if bookingUrl}
                        <a
                            href={bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="mt-2 px-2 py-1 text-xs rounded bg-gray-500 text-white hover:bg-primary/90 transition-colors text-center"
                        >
                            Buchen
                        </a>
                    {:else}
                        <!-- DEBUG: Fallback-Text wenn UUID fehlt -->
                        <span class="mt-2 px-2 py-1 text-xs text-center">
                            Nicht buchbar
                        </span>
                    {/if}
                {/if}
            </div>
        {:else}
            <!-- Fallback content if no booking appointments are available -->
            <p class="text-center text-gray-500">
                Keine Buchungstermine verfügbar.
            </p>
        {/each}
    </div>
</div>
