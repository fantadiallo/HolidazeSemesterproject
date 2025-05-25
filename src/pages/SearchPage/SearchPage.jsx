import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../../utils/constants";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const checkIn = queryParams.get("checkIn");
  const checkOut = queryParams.get("checkOut");

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(`${API_BASE}/venues`);
        const { data } = await response.json();
        setVenues(data);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Search Results</h2>
      <p>Check-in: {checkIn}</p>
      <p>Check-out: {checkOut}</p>

      {loading ? (
        <p>Loading venues...</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {venues.map((venue) => (
            <div key={venue.id} className="col">
              <div className="card h-100">
                <img
                  src={
                    venue.media?.[0]?.url || "https://via.placeholder.com/300"
                  }
                  className="card-img-top"
                  alt={venue.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{venue.name}</h5>
                  <p className="card-text">{venue.description}</p>
                  <p className="card-text">
                    <strong>${venue.price}</strong> / night
                  </p>
                  <a
                    href={`/venue/${venue.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
