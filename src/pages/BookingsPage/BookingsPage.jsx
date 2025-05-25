import { useEffect, useState } from 'react';
import { getUser } from '../../utils/storage';
import { getBookingsByUser } from '../../services/api'; 
import styles from './BookingsPage.module.scss';

/**
 * BookingsPage Component
 * Displays a list of bookings made by the logged-in user.
 *
 * Features:
 * - Fetches bookings for the current user from the API.
 * - Shows a loading message while fetching.
 * - Displays a message if there are no bookings.
 * - Renders each booking with venue image, name, dates, guest count, and location.
 *
 * @returns {JSX.Element} The rendered BookingsPage component.
 */
export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!user) return;

    async function fetch() {
      const data = await getBookingsByUser(user.name);
      setBookings(data);
      setLoading(false);
    }

    fetch();
  }, [user]);

  if (loading) return <p>Loading your bookings...</p>;
  if (!bookings.length) return <p>You have no bookings yet.</p>;

  return (
    <div className={styles.bookingsPage}>
      <h2>My Bookings</h2>
      <div className={styles.grid}>
        {bookings.map((booking) => (
          <div key={booking.id} className={styles.card}>
            <img src={booking.venue?.media[0]?.url} alt={booking.venue?.name} />
            <div>
              <h5>{booking.venue?.name}</h5>
              <p>
                {new Date(booking.dateFrom).toLocaleDateString()} →{' '}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
              <p>Guests: {booking.guests}</p>
              <p>Location: {booking.venue?.location?.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
