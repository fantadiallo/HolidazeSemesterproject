import { useEffect, useState } from "react";
import { fetchProfile } from "../../services/api";
import { getUser } from "../../utils/storage";
import { Link, useNavigate } from "react-router-dom";

/**
 * MyVenuesPage Component
 * Displays a list of venues managed by the currently logged-in user.
 *
 * Features:
 * - Fetches the user's profile and venues from the API.
 * - Redirects to login if the user is not authenticated.
 * - Renders each venue with image, name, price, and action buttons for viewing or editing.
 *
 * @returns {JSX.Element} The rendered MyVenuesPage component.
 */
export default function MyVenuesPage() {
  const user = getUser();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    if (!user) return navigate("/login");
    async function load() {
      const data = await fetchProfile(user.name);
      setVenues(data.venues || []);
    }
    load();
  }, [user, navigate]);

  return (
    <div className="container py-4">
      <h2>My Venues</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {venues.map((venue) => (
          <div key={venue.id} className="col">
            <div className="card">
              <img
                src={venue.media?.[0]?.url}
                className="card-img-top"
                alt={venue.name}
              />
              <div className="card-body">
                <h5>{venue.name}</h5>
                <p>${venue.price} / night</p>
                <Link
                  to={`/venue/${venue.id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  View
                </Link>
                <Link
                  to={`/venues/edit/${venue.id}`}
                  className="btn btn-sm btn-outline-secondary ms-2"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
