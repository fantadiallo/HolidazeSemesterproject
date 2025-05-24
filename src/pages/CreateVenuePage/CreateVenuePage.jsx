import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHeaders } from "../../utils/headers";
import { getUser } from "../../utils/storage";
import { API_BASE } from "../../utils/constants";
import styles from "./CreateVenuePage.module.scss";

export default function CreateVenuePage() {
  const navigate = useNavigate();
  const user = getUser();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: "",
    price: "",
    maxGuests: "",
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

    const newVenue = {
      name: formData.name,
      description: formData.description,
      media: [{ url: formData.media, alt: formData.name || "Venue image" }],
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      location: formData.location,
      meta: formData.meta,
    };

    try {
      const res = await fetch(`${API_BASE}/venues`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(newVenue),
      });

      if (res.ok) {
        navigate("/profile");
      } else {
        const error = await res.json();
        alert(error.errors?.[0]?.message || "Failed to create venue");
      }
    } catch (err) {
      alert("Something went wrong while creating the venue.");
      console.error(err);
    }
  }

  return (
    <div className={styles.venueFormPage}>
      <h2>Create Venue</h2>
      <form onSubmit={handleSubmit}>
        <label>Venue Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required />

        <label>Image URL</label>
        <input type="url" name="media" value={formData.media} onChange={handleChange} required />

        <label>Price per night</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />

        <label>Max Guests</label>
        <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} required min="1" />

        <h5>Location</h5>
        <input type="text" name="location.address" placeholder="Address" value={formData.location.address} onChange={handleChange} />
        <input type="text" name="location.city" placeholder="City" value={formData.location.city} onChange={handleChange} />
        <input type="text" name="location.zip" placeholder="ZIP Code" value={formData.location.zip} onChange={handleChange} />
        <input type="text" name="location.country" placeholder="Country" value={formData.location.country} onChange={handleChange} />

        <h5>Amenities</h5>
        {["wifi", "parking", "breakfast", "pets"].map((key) => (
          <div className="form-check" key={key}>
            <input
              className="form-check-input"
              type="checkbox"
              name={`meta.${key}`}
              id={key}
              checked={formData.meta[key]}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          </div>
        ))}

        <button type="submit" className="btn btn-success mt-3">
          Create Venue
        </button>
      </form>
    </div>
  );
}
