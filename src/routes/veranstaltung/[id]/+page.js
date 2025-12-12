import { fetchProduct, fetchBookings } from "$lib/api";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // Product zuerst laden (mit join=courses)
  const product = await fetchProduct(params.id, fetch);

  // Bookings für das Haupt-Product laden
  const bookings = fetchBookings(params.id, { customFetch: fetch });

  // Heutiges Datum für Filter (auf Mitternacht normalisiert)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Wenn Courses vorhanden, Bookings für jeden Course laden und filtern
  let courseBookings = {};
  let filteredCourses = [];

  if (product.courses && product.courses.length > 0) {
    const courseBookingPromises = product.courses.map(async (course) => {
      const courseBookingData = await fetchBookings(course.id, {
        customFetch: fetch,
      });
      return { course, bookings: courseBookingData };
    });

    const results = await Promise.all(courseBookingPromises);

    results.forEach(({ course, bookings: courseBookingData }) => {
      // 1. Prüfe ob Bookings vorhanden
      const hasBookings = courseBookingData?.data?.length > 0;

      // 2. Prüfe ob Course gültig ist (endDate muss existieren UND > heute)
      const endDate = course.endDate ? new Date(course.endDate) : null;
      const isValid = endDate && endDate > today;

      // Nur hinzufügen wenn Bookings vorhanden UND gültiges endDate
      if (hasBookings && isValid) {
        courseBookings[course.id] = courseBookingData;
        filteredCourses.push(course);
      }
    });
  }

  return {
    product: { ...product, courses: filteredCourses },
    bookings,
    courseBookings,
  };
}
