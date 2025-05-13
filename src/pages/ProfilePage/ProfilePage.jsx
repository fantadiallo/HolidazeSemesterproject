import { useEffect, useState } from 'react';
import { getUser } from '../../utils/storage';
import { fetchProfile, updateAvatar, deleteVenue } from '../../services/api';
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
    const confirmed = window.confirm('Are you sure you want to delete this venue?');
    if (!confirmed) return;

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

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className={`container ${styles.profilePage}`}>
      {/* Top Section */}
      <div className="row align-items-center mb-4">
        <div className="col-md-3 text-center">
          <img
            src={profile.avatar?.url || 'https://via.placeholder.com/140'}
            alt={profile.avatar?.alt || 'Avatar'}
            className="rounded-circle img-fluid"
            style={{ width: '140px', height: '140px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-1">{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Bookings: {profile._count?.bookings} | Venues: {profile._count?.venues}</p>
        </div>
        <div className="col-md-3 text-center">
          <button className="btn btn-primary">Edit Profile</button>
        </div>
      </div>

      {/* Avatar Update */}
      <form onSubmit={handleAvatarUpdate} className="mb-5">
        <label htmlFor="avatarUrl" className="form-label">Update Avatar URL</label>
        <div className="input-group">
          <input
            type="url"
            id="avatarUrl"
            className="form-control"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-outline-primary">Update</button>
        </div>
      </form>

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
            <h4>My Venues</h4>
            <Link to="/venues/create" className="btn btn-sm btn-success">+ Create Venue</Link>
          </div>

          {profile.venues?.length ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {profile.venues.map((venue) => (
                <div key={venue.id} className="col">
                  <div className={`card ${styles.venueCard}`}>
                    <img
                      src={venue.media[0]?.url}
                      className="card-img-top"
                      alt={venue.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{venue.name}</h5>
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
    </div>
  );
}
