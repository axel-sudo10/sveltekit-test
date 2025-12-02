<script>
    let { bookings } = $props();

    // Extract actual booking array from API response, and sort it chronologically
    let bookingsArray = $derived(
        bookings && Array.isArray(bookings.data)
            ? [...bookings.data].sort(
                  (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
              )
            : [],
    );

    // Format a single booking into the required display properties
    const formatBooking = (booking) => {
        const date = new Date(booking.startDate);
        const dayName = date.toLocaleDateString("de-DE", { weekday: "long" });

        const startTime = date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const endTime = new Date(booking.endDate).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });

        // Determine availability status
        const isAvailable = booking.availableParticipantCount > 0;
        const status = isAvailable ? "frei" : "voll";

        return {
            dayName,
            timeRange: `${startTime} - ${endTime} Uhr`,
            status,
        };
    };
</script>

<!-- 
  Horizontal, scrollable list of booking appointments.
  - `flex`: Creates a flexbox container.
  - `overflow-x-auto`: Enables horizontal scrolling if content exceeds the container width.
  - `gap-16`: Corresponds to `gap: 4rem`.
  - `pb-4`: Adds some padding at the bottom to avoid the scrollbar overlapping content.
-->
<div class="flex overflow-x-auto gap-16 pb-4">
    {#each bookingsArray as booking (booking.id)}
        {@const formatted = formatBooking(booking)}
        <!-- 
      Appointment Card:
      - `flex-shrink-0`: Prevents cards from shrinking to fit the container.
      - `aspect-square w-[9rem]`: Sets a fixed width and a 1:1 aspect ratio.
      - `flex-col justify-between`: Stacks content vertically and spaces it out.
      - `bg-gray-50 p-4 pb-8 shadow-md`: General styling for background, padding, and shadow.
    -->
        <div
            class="flex-shrink-0 flex aspect-square w-[6rem] flex-col justify-between bg-gray-50 p-3 pb-6 shadow-md"
        >
            <div class="flex w-full justify-between">
                <p>{formatted.dayName}</p>
                <!-- 
            Dynamically set text color based on status.
            - `text-green-600`: for 'frei' (available)
            - `text-red-600`: for 'voll' (full)
          -->
                <p
                    class:text-green-600={formatted.status === "frei"}
                    class:text-red-600={formatted.status === "voll"}
                >
                    {formatted.status}
                </p>
            </div>

            <p class="mt-1 text-center text-xs">{formatted.timeRange}</p>
        </div>
    {:else}
        <p class="text-center text-gray-500">
            Keine Buchungstermine verfügbar.
        </p>
    {/each}
</div>
