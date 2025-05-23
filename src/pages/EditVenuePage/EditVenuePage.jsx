import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteVenue } from '../../services/api';
import { API_BASE } from '../../utils/constants';
import { getHeaders } from '../../utils/headers';

export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: '',
    price: '',
    maxGuests: '',
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });

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
          meta: {
            wifi: data.meta?.wifi || false,
            parking: data.meta?.parking || false,
            breakfast: data.meta?.breakfast || false,
            pets: data.meta?.pets || false,
          },
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('meta.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        meta: { ...prev.meta, [field]: checked },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

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
      meta: formData.meta,
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="url"
            className="form-control"
            name="media"
            value={formData.media}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Max Guests</label>
          <input
            type="number"
            className="form-control"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <h5 className="mt-4">Amenities</h5>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="meta.wifi"
            id="wifi"
            checked={formData.meta.wifi}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="wifi">Wi-Fi</label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="meta.parking"
            id="parking"
            checked={formData.meta.parking}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="parking">Parking</label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="meta.breakfast"
            id="breakfast"
            checked={formData.meta.breakfast}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="breakfast">Breakfast Included</label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="meta.pets"
            id="pets"
            checked={formData.meta.pets}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="pets">Pet Friendly</label>
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
