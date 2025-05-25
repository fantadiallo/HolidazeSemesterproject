import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./VenuePage.module.scss";
import { getUser } from "../../utils/storage";
import { API_BASE } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

/**
 * VenuePage Component
 * Displays detailed information about a single venue, including images, description, location, and booking options.
 * Fetches venue data by ID, shows unavailable dates, and allows users to select a date range and book the venue.
 *
 * Features:
 * - Fetches venue details, bookings, and owner info from the API.
 * - Shows venue image, description, location, max guests, and rating.
 * - Displays a date range picker with disabled dates for existing bookings.
 * - Calculates total price based on selected nights.
 * - Allows logged-in users to book the venue.
 * - Redirects to bookings page after successful booking.
 *
 * @returns {JSX.Element} The rendered VenuePage component.
 */
export default function VenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(
          `${API_BASE}/venues/${id}?_bookings=true&_owner=true`,
        );
        const data = await res.json();
        setVenue(data.data);

        const bookings = data.data.bookings || [];
        const ranges = bookings.map((b) => ({
          start: new Date(b.dateFrom),
          end: new Date(b.dateTo),
        }));
        setBookedRanges(ranges);
      } catch (err) {
        console.error("Failed to fetch venue:", err);
        alert("Could not load venue.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading venue...</p>;
  if (!venue) return <p className="text-center mt-4">Venue not found.</p>;

  const disabledDates = bookedRanges.flatMap((range) => {
    const dates = [];
    for (
      let d = new Date(range.start);
      d <= range.end;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }
    return dates;
  });

  const nights =
    selection[0].startDate && selection[0].endDate
      ? (selection[0].endDate - selection[0].startDate) / (1000 * 60 * 60 * 24)
      : 0;

  const total = nights > 0 ? nights * venue.price : 0;

  async function handleBooking() {
    const user = getUser();
    const profileName = user?.name;

    if (!profileName) {
      alert("Please log in to book.");
      return;
    }

    const bookingData = {
      dateFrom: selection[0].startDate.toISOString(),
      dateTo: selection[0].endDate.toISOString(),
      guests: venue.maxGuests,
      venueId: venue.id,
    };

    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/bookings");
      } else {
        alert(result.errors?.[0]?.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <div className={styles.venuePage}>
      <div className="redirectLink mb-3">
        <Link to="/" className="text-decoration-underline text-primary">
          &larr; Back to Homepage
        </Link>
      </div>
      <div className={styles.left}>
        <img
          src={venue.media[0]?.url || "/placeholder.jpg"}
          alt={venue.media[0]?.alt || venue.name}
          className={styles.image}
        />
        <div className={styles.meta}>
          <p>
            <strong>Location:</strong> {venue.location.city},{" "}
            {venue.location.country}
          </p>
          <p>
            <strong>Max guests:</strong> {venue.maxGuests}
          </p>
          <p>
            <strong>Stars:</strong> {venue.rating || "Not rated"}
          </p>
          <p>
            <strong>Type:</strong> Guesthouse
          </p>
        </div>
        <p className={styles.description}>{venue.description}</p>
      </div>

      <div className={styles.right}>
        <div className={styles.bookingBox}>
          <h3>Select Your Stay</h3>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setSelection([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={selection}
            minDate={new Date()}
            disabledDates={disabledDates}
          />
          <button
            onClick={handleBooking}
            className="btn btn-primary w-100 mt-3"
          >
            Reserve
          </button>
          <p className="mt-2 text-center fw-bold">Total: ${total}</p>
        </div>
      </div>
    </div>
  );
}
