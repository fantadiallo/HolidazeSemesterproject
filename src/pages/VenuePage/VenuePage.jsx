import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { addDays, isWithinInterval } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import styles from './VenuePage.module.scss';

export default function VenuePage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    async function fetchVenue() {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`
      );
      const data = await res.json();
      setVenue(data.data);

      const bookings = data.data.bookings || [];

      const ranges = bookings.map((b) => ({
        start: new Date(b.dateFrom),
        end: new Date(b.dateTo),
      }));

      setBookedRanges(ranges);
    }

    fetchVenue();
  }, [id]);

  if (!venue) return <p>Loading...</p>;

  const disabledDates = bookedRanges.flatMap((range) => {
    const dates = [];
    for (let d = new Date(range.start); d <= range.end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  });

  const nights =
    selection[0].startDate && selection[0].endDate
      ? (selection[0].endDate - selection[0].startDate) / (1000 * 60 * 60 * 24)
      : 0;
  const total = nights > 0 ? nights * venue.price : 0;

  return (
    <div className={styles.venuePage}>
      <div className={styles.left}>
        <img
          src={venue.media[0]?.url}
          alt={venue.media[0]?.alt || venue.name}
          className={styles.image}
        />
        <div className={styles.meta}>
          <p><strong>Location:</strong> {venue.location.city}, {venue.location.country}</p>
          <p><strong>Max guests:</strong> {venue.maxGuests}</p>
          <p><strong>Stars:</strong> {venue.rating || 'Not rated'}</p>
          <p><strong>Type:</strong> Guesthouse</p>
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
          <button className="btn-custom w-100 mt-3">Reserve</button>
          <p className="mt-2 text-center">Total: ${total}</p>
        </div>
      </div>
    </div>
  );
}
