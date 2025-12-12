const API_BASE_URL = 'https://backbone-web-api.production.regensburg.delcom.nl';

async function fetchProduct(id) {
    const params = new URLSearchParams([
        ['join', 'tags'],
        ['join', 'location'],
        ['join', 'courses']
    ]);
    const url = `${API_BASE_URL}/products/${id}?${params}`;
    console.log(`Fetch Product: ${url}`);
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
    console.log(`Fetch Bookings: ${url}`);
    const res = await fetch(url);
    return res.json();
}

async function loadSimulation(params) {
  console.log("--- SIMULATION V3 START ---");
  const product = await fetchProduct(params.id);
  const bookings = await fetchBookings(params.id); // Parent bookings

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(`Today (Simulated): ${today.toISOString()}`);

  if (bookings && bookings.data && product.courses) {
      const coursesMap = new Map(product.courses.map(c => [c.id, c]));
      
      console.log(`
--- FILTER INSPECTION ---
`);
      
      bookings.data.forEach(b => {
          const bStart = new Date(b.startDate);
          const bStartStr = bStart.toLocaleDateString('de-DE');
          
          console.log(`
Booking: ${bStartStr} (ID: ${b.id})
`);
          console.log(`  CourseID: ${b.courseId}`);

          if (!b.courseId) {
              console.log(`  -> KEEP (No Course ID)`);
              return;
          }

          const course = coursesMap.get(b.courseId);
          if (!course) {
              console.log(`  -> KEEP (Course not in Product 66)`);
              return;
          }

          const courseStart = course.startDate ? new Date(course.startDate) : null;
          const courseEnd = course.endDate ? new Date(course.endDate) : null;
          
          console.log(`  Course ${course.id}: ${courseStart?.toLocaleDateString()} - ${courseEnd?.toLocaleDateString()}`);

          // 1. Kurs abgelaufen?
          let reason = "";
          if (courseEnd && courseEnd < today) {
              reason = `Course Expired`;
              console.log(`  -> FILTER: Course End ${courseEnd.toISOString()} < Today`);
          }

          // 2. Booking vor Kurs-Start?
          if (courseStart && bStart < courseStart) {
              reason = reason || `Booking too early`;
              console.log(`  -> FILTER: Booking Start ${bStart.toISOString()} < Course Start ${courseStart.toISOString()}`);
          }
          
          if (!reason) {
              console.log(`  -> KEEP: VALID`);
          }
      });
  }
  console.log("--- SIMULATION V3 END ---");
}

loadSimulation({ id: 66 }).catch(console.error);
