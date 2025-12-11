import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // Product zuerst laden (mit join=courses)
  const product = await fetchProductWithErrorHandling(fetch, params.id);

  // Bookings für das Haupt-Product laden
  const bookings = fetchBookingsWithErrorHandling(fetch, params.id);

  // Wenn Courses vorhanden, Bookings für jeden Course laden
  let courseBookings = {};
  if (product.courses && product.courses.length > 0) {
    const courseBookingPromises = product.courses.map(async (course) => {
      const courseBookingData = await fetchBookingsWithErrorHandling(
        fetch,
        course.id,
      );
      return { courseId: course.id, bookings: courseBookingData };
    });

    const results = await Promise.all(courseBookingPromises);
    results.forEach(({ courseId, bookings }) => {
      courseBookings[courseId] = bookings;
    });
  }

  return {
    product,
    bookings,
    courseBookings,
  };
}

// Helper: Product mit Error Handling (inkl. join=courses)
async function fetchProductWithErrorHandling(fetch, id) {
  const res = await fetch(
    `https://backbone-web-api.production.regensburg.delcom.nl/products/${id}?join=tags&join=location&join=documents&join=translations&join=linkedSubscriptions&join=courses`,
  );

  if (!res.ok) {
    error(res.status, "Failed to fetch product from external API.");
  }

  return await res.json();
}

// Helper: Bookings mit Error Handling
async function fetchBookingsWithErrorHandling(fetch, id) {
  const res = await fetch(
    `https://backbone-web-api.production.regensburg.delcom.nl/bookings?limit=60&page=1&s={"linkedProductId":{"$in":[${id}]}}`,
  );

  if (!res.ok) {
    error(res.status, "Failed to fetch bookings from external API.");
  }

  return await res.json();
}
