import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './VenueSection.module.scss';

const filters = ['wifi', 'parking', 'breakfast', 'pets'];

/**
 * VenueSection Component
 * Displays a list of venues with search and filter functionality.
 * @returns {JSX.Element} The rendered VenueSection component.
 */
export default function VenueSection() {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  /**
   * Fetches venues from the API and updates the state.
   */
  useEffect(() => {
    async function fetchVenues() {
      const response = await fetch(
        'https://v2.api.noroff.dev/holidaze/venues?_owner=true&_bookings=true'
      );
      const result = await response.json();
      setVenues(result.data);
    }
    fetchVenues();
  }, []);

  /**
   * Filters venues based on the search term and selected filter.
   * @returns {Array} The filtered list of venues.
   */
  const filteredVenues = venues.filter((venue) => {
    const matchSearch = venue.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = selectedFilter
      ? venue.meta?.[selectedFilter] === true
      : true;
    return matchSearch && matchFilter;
  });

  return (
    <section className={styles.venueSection}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search venues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-secondary">Filter</button>
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterButton} ${
              selectedFilter === filter ? styles.active : ''
            }`}
            onClick={() =>
              setSelectedFilter(selectedFilter === filter ? '' : filter)
            }
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredVenues.map((venue) => (
          <div key={venue.id} className={styles.card}>
            <img src={venue.media[0]?.url} alt={venue.media[0]?.alt || venue.name} />
            <h5>{venue.name}</h5>
            <p>Hosted by: {venue.owner?.name}</p>
            <p>Location: {venue.location?.city}</p>
            <p>${venue.price} / night</p>
            <Link to={`/venue/${venue.id}`} className="btn btn-primary btn-sm">
              View Venue
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
