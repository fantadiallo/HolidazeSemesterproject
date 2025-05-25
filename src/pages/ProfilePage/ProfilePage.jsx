import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/storage';
import {
  fetchProfile,
  updateAvatar,
  deleteVenue,
  cancelBooking,
} from '../../services/api';
import styles from './ProfilePage.module.scss';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('profile');
    return stored ? JSON.parse(stored) : null;
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      const data = await fetchProfile(user.name);
      setProfile(data);
      setAvatarUrl(data.avatar?.url || '');
      setLoading(false);
      localStorage.setItem('profile', JSON.stringify(data));
    }

    loadProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
    }
  }, [profile]);

  async function handleAvatarUpdate(e) {
    e.preventDefault();
    const updated = await updateAvatar(user.name, avatarUrl);
    setProfile(updated);
    alert('Avatar updated!');
    localStorage.setItem('profile', JSON.stringify(updated));
  }

  async function handleDelete(venueId) {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    try {
      await deleteVenue(venueId);
      alert('Venue deleted');
      setProfile((prev) => {
        const updated = {
          ...prev,
          venues: prev.venues.filter((v) => v.id !== venueId),
        };
        localStorage.setItem('profile', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      alert('Failed to delete venue.');
      console.error(error);
    }
  }

  async function handleCancelBooking(bookingId) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      alert('Booking cancelled');
      setProfile((prev) => {
        const updated = {
          ...prev,
          bookings: prev.bookings.filter((b) => b.id !== bookingId),
        };
        localStorage.setItem('profile', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      alert('Failed to cancel booking.');
      console.error(error);
    }
  }

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className={`container ${styles.profilePage}`}>
      <div className="row align-items-center mb-4">
        <div className="col-md-3 text-center">
          <img
            src={avatarUrl || 'https://via.placeholder.com/140'}
            alt={profile.avatar?.alt || 'Avatar'}
            className="rounded-circle img-fluid shadow"
            style={{ width: '140px', height: '140px', objectFit: 'cover' }}
          />
          <label htmlFor="avatarUrl" className="btn btn-sm btn-outline-primary mt-2">
            Update Avatar
          </label>
          <form onSubmit={handleAvatarUpdate} className="mt-2">
            <div className="input-group input-group-sm">
              <input
                type="url"
                id="avatarUrl"
                className="form-control"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success">Save</button>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <h2 className="mb-1">{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Bookings: {profile._count?.bookings} | Venues: {profile._count?.venues}</p>
        </div>
      </div>

      {/* Everyone’s Upcoming Booked Venues */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Upcoming Booked Venues</h4>
          <Link to="/bookings" className="btn btn-sm btn-outline-secondary">View All</Link>
        </div>

        {profile.bookings?.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {profile.bookings.map((booking) => (
              <div key={booking.id} className="col">
                <div className={`card ${styles.bookingCard}`}>
                  <img
                    src={booking.venue?.media[0]?.url || 'https://via.placeholder.com/300'}
                    className="card-img-top"
                    alt={booking.venue?.name}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{booking.venue?.name}</h6>
                    <p className="card-text small mb-1">
                      {new Date(booking.dateFrom).toLocaleDateString()} → {new Date(booking.dateTo).toLocaleDateString()}
                    </p>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no upcoming bookings right now.</p>
        )}
      </section>

      {/* My Venues */}
      {profile.venueManager && (
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>My Venues</h4>
            <Link to="/venues/create" className="btn btn-sm btn-success">+ Create Venue</Link>
          </div>
          {profile.venues?.length ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {profile.venues.map((venue) => (
                <div key={venue.id} className="col">
                  <div className={`card ${styles.venueCard}`}>
                    <img
                      src={venue.media[0]?.url || 'https://via.placeholder.com/300'}
                      className="card-img-top"
                      alt={venue.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{venue.name}</h5>
                      <p className="card-text small">Location: {venue.location?.city}</p>
                      <p className="card-text">${venue.price} / night</p>
                      <div className="d-flex gap-2">
                        <Link to={`/venues/edit/${venue.id}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                        <button onClick={() => handleDelete(venue.id)} className="btn btn-sm btn-danger">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven’t created any venues yet.</p>
          )}
        </section>
      )}

      {/* Bookings on My Venues */}
      {profile.venueManager && (
        <section>
          <h4 className="mb-3">Bookings on My Venues</h4>

          {profile.venues?.some((v) => v.bookings?.length > 0) ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {profile.venues.flatMap((venue) =>
                (venue.bookings || []).map((booking) => (
                  <div key={booking.id} className="col">
                    <div className={`card ${styles.bookingCard}`}>
                      <img
                        src={venue.media?.[0]?.url || 'https://via.placeholder.com/300'}
                        className="card-img-top"
                        alt={venue.name}
                      />
                      <div className="card-body">
                        <h6 className="card-title">{venue.name}</h6>
                        <p className="card-text small mb-1">
                          {new Date(booking.dateFrom).toLocaleDateString()} → {new Date(booking.dateTo).toLocaleDateString()}
                        </p>
                        <p className="card-text small">Booked by: {booking.customer?.name || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p>No one has booked your venues yet.</p>
          )}
        </section>
      )}
    </div>
  );
}
