import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteVenue } from "../../services/api";
import { API_BASE } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";
import styles from "./EditVenuePage.module.scss";

/**
 * EditVenuePage Component
 * Renders a form for editing an existing venue.
 *
 * Features:
 * - Fetches venue data by ID and populates the form.
 * - Allows venue managers to update venue details, location, and amenities.
 * - Submits updated data to the API.
 * - Allows venue deletion with confirmation.
 * - Redirects to the profile page after successful update or deletion.
 *
 * @returns {JSX.Element} The rendered EditVenuePage component.
 */
export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: "",
    price: "",
    maxGuests: "",
    locationLabel: "",
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
    },
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
          media: data.media?.[0]?.url || "",
          price: data.price,
          maxGuests: data.maxGuests,
          locationLabel: data.location?.label || "",
          location: {
            address: data.location?.address || "",
            city: data.location?.city || "",
            zip: data.location?.zip || "",
            country: data.location?.country || "",
          },
          meta: {
            wifi: data.meta?.wifi || false,
            parking: data.meta?.parking || false,
            breakfast: data.meta?.breakfast || false,
            pets: data.meta?.pets || false,
          },
        });
      } catch (error) {
        alert("Failed to load venue.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else if (name.startsWith("meta.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        meta: { ...prev.meta, [field]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
          alt: formData.name || "Venue image",
        },
      ],
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      location: {
        ...formData.location,
        label: formData.locationLabel,
      },
      meta: formData.meta,
    };

    try {
      const res = await fetch(`${API_BASE}/venues/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(updatedVenue),
      });

      if (res.ok) {
        navigate("/profile");
      } else {
        const error = await res.json();
        alert(error.errors?.[0]?.message || "Failed to update venue");
      }
    } catch (err) {
      alert("Something went wrong while saving.");
      console.error(err);
    }
  }

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await deleteVenue(id);
        navigate("/profile");
      } catch (error) {
        alert("Failed to delete venue.");
        console.error(error);
      }
    }
  }

  if (loading || !venue)
    return <p className="text-center mt-4">Loading venue...</p>;

  return (
    <div className={styles.venueFormPage}>
      <h2>Edit Venue</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          type="url"
          name="media"
          value={formData.media}
          onChange={handleChange}
          required
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
        />

        <label>Max Guests</label>
        <input
          type="number"
          name="maxGuests"
          value={formData.maxGuests}
          onChange={handleChange}
          required
          min="1"
        />

        <h5>Location</h5>
        <input
          type="text"
          name="locationLabel"
          placeholder="Short label"
          value={formData.locationLabel}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location.address"
          placeholder="Address"
          value={formData.location.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location.city"
          placeholder="City"
          value={formData.location.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location.zip"
          placeholder="ZIP"
          value={formData.location.zip}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location.country"
          placeholder="Country"
          value={formData.location.country}
          onChange={handleChange}
        />

        <h5>Amenities</h5>
        {["wifi", "parking", "breakfast", "pets"].map((key) => (
          <div className="form-check" key={key}>
            <input
              type="checkbox"
              className="form-check-input"
              id={key}
              name={`meta.${key}`}
              checked={formData.meta[key]}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          </div>
        ))}

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
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
