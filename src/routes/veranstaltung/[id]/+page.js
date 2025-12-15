import { fetchProduct, fetchBookings } from "$lib/api";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  // Product zuerst laden (mit join=courses)
  const product = await fetchProduct(params.id, fetch);

  // Bookings für das Haupt-Product laden
  const bookings = await fetchBookings(params.id, { customFetch: fetch });

  // Heutiges Datum für Filter (auf Mitternacht normalisiert)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Wenn Courses vorhanden, Bookings für jeden Course laden und filtern
  let courseBookings = {};
  let filteredCourses = [];

  if (product.courses && product.courses.length > 0) {
    const courseBookingPromises = product.courses.map(async (course) => {
      // FIX: Slots sind am PARENT Product (params.id) aufgehängt, aber mit courseId markiert!
      // Wir suchen also: linkedProductId = params.id AND courseId = course.id
      const courseBookingData = await fetchBookings(params.id, {
        customFetch: fetch,
        limit: 300,
        query: { courseId: course.id }
      });
      return { course, bookings: courseBookingData };
    });

    const results = await Promise.all(courseBookingPromises);

    results.forEach(({ course, bookings: courseBookingData }) => {
      // Datum parsen
      const courseStart = course.startDate ? new Date(course.startDate) : null;
      const courseEnd = course.endDate ? new Date(course.endDate) : null;
      const bookingsRaw = courseBookingData?.data || [];

      console.group(`Filter-Check für Kurs: ${course.id}`);
      console.log(`Zeitraum: ${courseStart?.toISOString()} bis ${courseEnd?.toISOString()}`);
      console.log(`Bookings vor Filter: ${bookingsRaw.length}`);

      // 1. Filter Bookings: Müssen im Kurs-Zeitraum liegen
      // Overlap Logic: (BookingStart < CourseEnd) && (BookingEnd > CourseStart)
      
      const validBookings = bookingsRaw.filter((booking) => {
        if (!courseStart || !courseEnd) return true; // Ohne Kurs-Daten kein Filter (oder strict false?) -> Hier permissive

        // FIX: API liefert startDate/endDate, nicht start/date
        const bookStart = new Date(booking.startDate); 
        const bookEnd = booking.endDate ? new Date(booking.endDate) : new Date(bookStart.getTime() + 60*60*1000); // 1h Fallback

        // Check for invalid dates
        if (isNaN(bookStart.getTime())) return false;

        // Strict Check: Booking darf nicht VOR dem Kurs beginnen
        if (bookStart < courseStart) return false;

        const overlaps = bookStart < courseEnd && bookEnd > courseStart;
        return overlaps;
      });

      console.log(`Bookings nach Zeitraum-Filter: ${validBookings.length}`);

      // 2. Prüfe ob Bookings vorhanden sind
      const hasBookings = validBookings.length > 0;

      

        

      

              // 3. Prüfe ob Course gültig ist

      

              const availableTill = course.availableTillDate ? new Date(course.availableTillDate) : null;

      

              

      

              // Logik: Kurs ist aktiv, wenn availableTill > heute ODER (falls nicht gesetzt) endDate > heute

      

              let isCourseActive = false;

      

              if (availableTill) {

      

                  isCourseActive = availableTill > today;

      

              } else if (courseEnd) {

      

                  isCourseActive = courseEnd > today;

      

              }

      

        

      

              if (!isCourseActive) {

      

                 console.log(`Ausschluss: Kurs nicht mehr verfügbar/abgelaufen.`);

      

              } else if (!hasBookings) {

      

                 console.log(`Ausschluss: Keine passenden Bookings im Zeitraum.`);

      

              } else {

      

                 console.log(`-> Kurs AKZEPTIERT.`);

      

              }

      

              console.groupEnd();

      

        

      

              // Nur hinzufügen wenn Bookings vorhanden UND aktiv

      

              if (hasBookings && isCourseActive) {

      

                // WICHTIG: Wir speichern die GEFILTERTEN Bookings, nicht die rohen!

      

                // Wir müssen die Struktur von courseBookingData beibehalten

      

                courseBookings[course.id] = { ...courseBookingData, data: validBookings };

      

                filteredCourses.push(course);

      

              }

      

            });

      

          }

      

        

      

                      // Extract unique linkedProductIds from all bookings

      

        

      

                      const allBookings = [

      

        

      

                        ...(bookings.data || []),

      

        

      

                        ...Object.values(courseBookings).flatMap((cb) => cb.data || []),

      

        

      

                      ];

      

        

      

                    

      

        

      

                        const uniqueLinkedProductIds = [

      

        

      

                    

      

        

      

                          ...new Set(allBookings.map((b) => b.productId).filter(Boolean)),

      

        

      

                    

      

        

      

                        ];

      

        

      

                    

      

        

      

                      const locationResources = {};

      

        

      

                      if (uniqueLinkedProductIds.length > 0) {

      

        

      

                        const locationProductPromises = uniqueLinkedProductIds.map(async (id) => {

      

        

      

                          const locationProduct = await fetchProduct(id, fetch);

      

        

      

                          locationResources[id] = locationProduct;

      

        

      

                        });

      

        

      

                        await Promise.all(locationProductPromises);

      

        

      

                      }

      

        

      

                    

      

        

      

                      // GLOBALER FILTER für 'bookings' (Parent Bookings)

      

        

      

                    

      

        

      

                      // Falls alle Kurse rausgefiltert wurden, greift ProductDetails auf 'bookings' zurück.

      

        

      

                    

      

        

      

                      // Diese müssen auch bereinigt werden, damit keine abgelaufenen Kurs-Buchungen auftauchen.

      

        

      

                    

      

        

      

                      if (bookings && bookings.data && product.courses) {

      

        

      

                        // ... (code omitted for brevity in replace block, but must match exact lines)

      

        

      

                        // Wait, I need to match exact context. I will use the "return" block which is unique.

      

        

      

                      }

      

        

      

                    

      

        

      

                      // Save first course ID for fallback before overwriting courses

      

        

      

                    

      

        

      

                      const firstCourseId = product.courses && product.courses.length > 0 ? product.courses[0].id : null;

      

        

      

                    

      

        

      

                      return {

      

        

      

                        product: { ...product, courses: filteredCourses, firstCourseId },

      

        

      

                        bookings,

      

        

      

                        courseBookings,

      

        

      

                        locationResources, // Add locationResources to the returned data

      

        

      

                      };

      

        

      

                    }

      
