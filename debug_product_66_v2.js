
const API_BASE_URL = 'https://backbone-web-api.production.regensburg.delcom.nl';

async function fetchProduct(id) {
    const params = new URLSearchParams([
        ['join', 'tags'],
        ['join', 'location'],
        ['join', 'courses']
    ]);
    const url = `${API_BASE_URL}/products/${id}?${params}`;
    console.log(`Fetching Product: ${url}`);
    const res = await fetch(url);
    return res.json();
}

async function fetchBookings(productId, query = {}) {
    const defaultQuery = { linkedProductId: { $in: [productId] } };
    const finalQuery = { ...defaultQuery, ...query };
    
    const params = new URLSearchParams([
        ['limit', '300'],
        ['page', '1'],
        ['s', JSON.stringify(finalQuery)]
    ]);
    const url = `${API_BASE_URL}/bookings?${params}`;
    console.log(`Fetching Bookings: ${url}`);
    const res = await fetch(url);
    return res.json();
}

async function main() {
    console.log("--- DEBUG PRODUCT 66 START (V2) ---");
    const product = await fetchProduct(66);
    
    if (!product.courses || product.courses.length === 0) {
        console.log("No courses found.");
        return;
    }

    console.log(`Found ${product.courses.length} courses.`);

    for (const course of product.courses) {
        console.log(`\n--- Course ID: ${course.id} ---`);
        const courseStartStr = course.startDate;
        const courseStart = courseStartStr ? new Date(courseStartStr) : null;
        
        console.log(`Title: ${course.title || course.name || course.description}`);
        console.log(`Raw Start Date: ${courseStartStr}`);
        console.log(`Parsed Start:   ${courseStart ? courseStart.toISOString() : 'null'}`);
        
        const bookingsData = await fetchBookings(66, { courseId: course.id });
        const bookings = bookingsData.data || [];
        console.log(`Total Bookings Fetched: ${bookings.length}`);

        if (bookings.length === 0) continue;

        let earlyBookings = 0;
        bookings.forEach((b, idx) => {
            const bStartStr = b.startDate;
            const bStart = new Date(bStartStr);

            const isBefore = courseStart && bStart < courseStart;
            
            if (isBefore || idx < 3) {
                console.log(`   [${idx}] Booking Start: ${bStartStr} (${bStart.toISOString()})`);
                console.log(`       Is Before Course Start? ${isBefore}`);
                console.log(`       Comparison: ${bStart.getTime()} < ${courseStart?.getTime()}`);
                if (isBefore) earlyBookings++;
            }
        });
        
        if (earlyBookings === 0) {
             console.log("   -> NO bookings found that are strictly before course start in this script.");
        } else {
             console.log(`   -> FOUND ${earlyBookings} bookings starting before course start.`);
        }
    }
    console.log("\n--- DEBUG END ---");
}

main().catch(console.error);
