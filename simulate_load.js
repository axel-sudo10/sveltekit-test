
const API_BASE_URL = 'https://backbone-web-api.production.regensburg.delcom.nl';

async function fetchProduct(id) {
    const params = new URLSearchParams([
        ['join', 'tags'],
        ['join', 'location'],
        ['join', 'courses']
    ]);
    const url = `${API_BASE_URL}/products/${id}?${params}`;
    const res = await fetch(url);
    return res.json();
}

async function fetchBookings(productId, options = {}) {
    const { limit = 60, page = 1, query = {} } = options;
    const defaultQuery = { linkedProductId: { $in: [productId] } };
    const finalQuery = { ...defaultQuery, ...query };
    const params = new URLSearchParams([
        ['limit', String(limit)],
        ['page', String(page)],
        ['s', JSON.stringify(finalQuery)]
    ]);
    const url = `${API_BASE_URL}/bookings?${params}`;
    const res = await fetch(url);
    return res.json();
}

async function loadSimulation(params) {
  console.log("--- SIMULATION START ---");
  const product = await fetchProduct(params.id);
  const bookings = await fetchBookings(params.id); // Parent bookings

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(`Today (Simulated): ${today.toISOString()}`);

  let courseBookings = {};
  let filteredCourses = [];

  if (product.courses && product.courses.length > 0) {
    const courseBookingPromises = product.courses.map(async (course) => {
      const courseBookingData = await fetchBookings(params.id, {
        limit: 300,
        query: { courseId: course.id }
      });
      return { course, bookings: courseBookingData };
    });

    const results = await Promise.all(courseBookingPromises);

    results.forEach(({ course, bookings: courseBookingData }) => {
      const courseStart = course.startDate ? new Date(course.startDate) : null;
      const courseEnd = course.endDate ? new Date(course.endDate) : null;
      const bookingsRaw = courseBookingData?.data || [];

      console.log(`\nCheck Course: ${course.id}`);
      console.log(`Interval: ${courseStart?.toISOString()} - ${courseEnd?.toISOString()}`);
      
      const validBookings = bookingsRaw.filter((booking) => {
        if (!courseStart || !courseEnd) return true;

        const bookStart = new Date(booking.startDate); 
        const bookEnd = booking.endDate ? new Date(booking.endDate) : new Date(bookStart.getTime() + 60*60*1000);

        if (isNaN(bookStart.getTime())) return false;

        // STRICT CHECK
        if (bookStart < courseStart) {
            // console.log(`  Filtered Out (Too Early): ${bookStart.toISOString()}`);
            return false;
        }

        const overlaps = bookStart < courseEnd && bookEnd > courseStart;
        return overlaps;
      });

      const hasBookings = validBookings.length > 0;
      const isValidDate = courseEnd && courseEnd > today;
      const availableTill = course.availableTillDate ? new Date(course.availableTillDate) : null;
      const isAvailable = !availableTill || availableTill > today;

      console.log(`  hasBookings: ${hasBookings} (${validBookings.length})`);
      console.log(`  isValidDate: ${isValidDate} (End > Today?)`);
      console.log(`  isAvailable: ${isAvailable} (AvailableTill > Today?)`);

      if (hasBookings && isValidDate && isAvailable) {
        console.log("  -> ACCEPTED");
        courseBookings[course.id] = { ...courseBookingData, data: validBookings };
        filteredCourses.push(course);
      } else {
        console.log("  -> REJECTED");
      }
    });
  }

  console.log(`\nTotal Filtered Courses: ${filteredCourses.length}`);
  console.log("--- SIMULATION END ---");
}

loadSimulation({ id: 66 }).catch(console.error);
