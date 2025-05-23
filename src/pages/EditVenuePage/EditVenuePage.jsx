import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteVenue } from '../../services/api';
import { API_BASE } from '../../utils/constants';
import { getHeaders } from '../../utils/headers';

/**
 * EditVenuePage Component
 * Allows users to edit or delete a venue.
 * Fetches venue data by ID, displays a form for editing, and provides a delete button.
 * On successful update or delete, navigates back to the profile page.
 * @returns {JSX.Element} The rendered EditVenuePage component.
 */
export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: '',
    price: '',
    maxGuests: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(`${API_BASE}/venues/${id}`);
        const { data } = await res.json();
        setVenue(data);
        setFormData({
          name: data.name,
          description: data.description,
          media: data.media?.[0]?.url || '',
          price: data.price,
          maxGuests: data.maxGuests,
        });
      } catch (error) {
        alert('Failed to load venue.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const updatedVenue = {
      name: formData.name,
      description: formData.description,
      media: [
        {
          url: formData.media,
          alt: formData.name || 'Venue image',
        },
      ],
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
    };

    try {
      const res = await fetch(`${API_BASE}/venues/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(updatedVenue),
      });

      if (res.ok) {
        navigate('/profile');
      } else {
        const error = await res.json();
        alert(error.errors?.[0]?.message || 'Failed to update venue');
      }
    } catch (err) {
      alert('Something went wrong while saving.');
      console.error(err);
    }
  }

  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await deleteVenue(id);
        navigate('/profile');
      } catch (error) {
        alert('Failed to delete venue.');
        console.error(error);
      }
    }
  }

  if (loading || !venue) return <p className="text-center mt-4">Loading venue...</p>;

  return (
    <div className="container py-4">
      <h2>Edit Venue</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="url"
            className="form-control"
            value={formData.media}
            onChange={(e) => setFormData({ ...formData, media: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Max Guests</label>
          <input
            type="number"
            className="form-control"
            value={formData.maxGuests}
            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
            required
            min="1"
          />
        </div>

        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button
          type="button"
          className="btn btn-danger ms-2"
          onClick={handleDelete}
        >
          Delete Venue
        </button>
      </form>
    </div>
  );
}
