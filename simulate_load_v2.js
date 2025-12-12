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
  console.log("--- SIMULATION V2 START ---");
  const product = await fetchProduct(params.id);
  const bookings = await fetchBookings(params.id); // Parent bookings

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(`Today (Simulated): ${today.toISOString()}`);

  let courseBookings = {};
  let filteredCourses = [];

  if (product.courses && product.courses.length > 0) {
    // ... (Course loop omitted for brevity, focusing on GLOBAL FILTER)
  }

  // GLOBALER FILTER LOGIC REPLICATION
  console.log(`\n--- GLOBAL FILTER DEBUG ---`);
  console.log(`Total Parent Bookings Before Filter: ${bookings.data ? bookings.data.length : 0}`);

  if (bookings && bookings.data && product.courses) {
      const coursesMap = new Map(product.courses.map(c => [c.id, c]));
      
      const kept = [];
      const removed = [];

      bookings.data.forEach(b => {
          // Log specific dates mentioned by user: 18.06.25, 28.05.25, 07.05.25, 30.04.25
          const bStart = new Date(b.startDate);
          const bStartStr = bStart.toLocaleDateString('de-DE');
          const isTarget = ['18.06.2025', '28.05.2025', '07.05.2025', '30.04.2025'].includes(bStartStr);

          if (!b.courseId) {
              if (isTarget) console.log(`  [Target] ${bStartStr} kept (No courseId)`);
              kept.push(b);
              return;
          }
          
          const course = coursesMap.get(b.courseId);
          if (!course) {
              if (isTarget) console.log(`  [Target] ${bStartStr} kept (Course ${b.courseId} not in product)`);
              kept.push(b); 
              return;
          }

          const courseStart = course.startDate ? new Date(course.startDate) : null;
          const courseEnd = course.endDate ? new Date(course.endDate) : null;
          const today = new Date(); 
          today.setHours(0,0,0,0);

          // 1. Kurs abgelaufen?
          let reason = "";
          if (courseEnd && courseEnd < today) {
              reason = `Course Expired (End: ${courseEnd.toISOString()} < Today)`;
          }

          // 2. Booking vor Kurs-Start?
          if (!reason && courseStart && bStart < courseStart) {
              reason = `Booking too early (${bStart.toISOString()} < ${courseStart.toISOString()})`;
          }

          if (reason) {
              if (isTarget) console.log(`  [Target] ${bStartStr} REMOVED: ${reason}`);
              removed.push(b);
          } else {
              if (isTarget) console.log(`  [Target] ${bStartStr} KEPT: Valid`);
              kept.push(b);
          }
      });
      
      console.log(`Removed: ${removed.length}`);
      console.log(`Kept: ${kept.length}`);
      bookings.data = kept;
  }
  
  console.log(`Total Parent Bookings After Filter: ${bookings.data.length}`);
  console.log("--- SIMULATION V2 END ---");
}

loadSimulation({ id: 66 }).catch(console.error);
