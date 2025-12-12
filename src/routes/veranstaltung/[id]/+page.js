import { fetchProduct, fetchBookings } from "$lib/api";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // Product zuerst laden (mit join=courses)
  const product = await fetchProduct(params.id, fetch);

  // Bookings für das Haupt-Product laden
  const bookings = fetchBookings(params.id, { customFetch: fetch });

  // Wenn Courses vorhanden, Bookings für jeden Course laden
  let courseBookings = {};
  if (product.courses && product.courses.length > 0) {
    const courseBookingPromises = product.courses.map(async (course) => {
      const courseBookingData = await fetchBookings(course.id, {
        customFetch: fetch,
      });
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
