import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHeaders } from "../../utils/headers";
import { getUser } from "../../utils/storage";
import { API_BASE } from "../../utils/constants";


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
  });

  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
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
      media: [
        {
          url: formData.media,
          alt: formData.name || "Venue image",
        },
      ],
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      location: formData.location,
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
    <div className="container py-4">
      <h2>Create Venue</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Venue Name</label>
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
          <label className="form-label">Price per night</label>
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

        <h5 className="mt-4">Location</h5>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            name="location.address"
            placeholder="Address"
            value={formData.location.address}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              name="location.city"
              placeholder="City"
              value={formData.location.city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              name="location.zip"
              placeholder="ZIP Code"
              value={formData.location.zip}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              name="location.country"
              placeholder="Country"
              value={formData.location.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success mt-3">
          Create Venue
        </button>
      </form>
    </div>
  );
}
