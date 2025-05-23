import { useEffect, useState } from 'react';
import { getUser } from '../../utils/storage';
import { fetchProfile, updateAvatar, deleteVenue, cancelBooking } from '../../services/api';
import styles from './ProfilePage.module.scss';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [profile, setProfile] = useState(null);
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
    }

    loadProfile();
  }, [user, navigate]);

  async function handleAvatarUpdate(e) {
    e.preventDefault();
    const updated = await updateAvatar(user.name, avatarUrl);
    setProfile(updated);
    alert('Avatar updated!');
  }

  async function handleDelete(venueId) {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;

    try {
      await deleteVenue(venueId);
      alert('Venue deleted');
      setProfile(prev => ({
        ...prev,
        venues: prev.venues.filter(v => v.id !== venueId),
      }));
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
      setProfile(prev => ({
        ...prev,
        bookings: prev.bookings.filter(b => b.id !== bookingId),
      }));
    } catch (error) {
      alert('Failed to cancel booking.');
      console.error(error);
    }
  }

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className={`container ${styles.profilePage}`}>
      {/* Top Section */}
      <div className="row align-items-center mb-4">
        <div className="col-md-3 text-center position-relative">
          <img
            src={avatarUrl || 'https://via.placeholder.com/140'}
            alt={profile.avatar?.alt || 'Avatar'}
            className="rounded-circle img-fluid shadow"
            style={{ width: '140px', height: '140px', objectFit: 'cover' }}
          />
          <label htmlFor="avatarUrl" className="btn btn-sm btn-outline-primary mt-2 d-block">
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

      {/* Upcoming Bookings */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Upcoming Bookings</h4>
          <Link to="/bookings" className="btn btn-sm btn-outline-secondary">View All</Link>
        </div>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
          {profile.bookings?.slice(0, 4).map((booking) => (
            <div key={booking.id} className="col">
              <div className={`card ${styles.bookingCard}`}>
                <img
                  src={booking.venue?.media[0]?.url}
                  className="card-img-top"
                  alt={booking.venue?.name}
                />
                <div className="card-body">
                  <h6 className="card-title">{booking.venue?.name}</h6>
                  <p className="card-text small mb-0">
                    {new Date(booking.dateFrom).toLocaleDateString()} → {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Venues */}
      {profile.venueManager && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 d-flex align-items-center gap-2">
              My Venues
              <Link to={`/venues/my`} className="btn btn-link ms-2 p-0 align-baseline">
                View All My Venues
              </Link>
            </h4>
            <Link to="/venues/create" className="btn btn-sm btn-success">+ Create Venue</Link>
          </div>

          {profile.venues?.length ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {profile.venues.map((venue) => (
                <div key={venue.id} className="col">
                  <div className={`card ${styles.venueCard}`}>
                    <Link to={`/venue/${venue.id}`}>
                      <img
                        src={venue.media[0]?.url}
                        className="card-img-top"
                        alt={venue.name}
                        style={{ cursor: "pointer" }}
                      />
                    </Link>
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/venue/${venue.id}`} className="text-decoration-none">
                          {venue.name}
                        </Link>
                      </h5>
                      <p className="card-text small">Hosted by {venue.owner?.name}</p>
                      <p className="card-text small">Location: {venue.location?.city}</p>
                      <p className="card-text">${venue.price} / night</p>
                      <div className="d-flex gap-2 mt-2">
                        <Link to={`/venues/edit/${venue.id}`} className="btn btn-sm btn-outline-primary">
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(venue.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven’t created any venues yet.</p>
          )}
        </div>
      )}

      {/* Bookings on My Venues */}
      {profile.venueManager && profile.venues?.some(v => v.bookings?.length > 0) && (
        <div className="mt-5">
          <h4>Bookings on My Venues</h4>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
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
                      <p className="card-text small mb-0">
                        {new Date(booking.dateFrom).toLocaleDateString()} → {new Date(booking.dateTo).toLocaleDateString()}
                      </p>
                      <p className="card-text small">Booked by: {booking.customer?.name || 'Unknown guest'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
