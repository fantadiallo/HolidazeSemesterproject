import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../utils/storage";
import styles from "./Header.module.scss";
import { useState } from "react";

/**
 * Header Component
 * Renders the site header with logo, navigation links, search form, and user menu.
 *
 * Features:
 * - Displays navigation links based on user authentication and role (venue manager).
 * - Provides a search form with date pickers for check-in and check-out.
 * - Handles user logout and navigation.
 *
 * @returns {JSX.Element} The rendered Header component.
 */
export default function Header() {
  const user = getUser();
  const isVenueManager = user?.venueManager;
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  function handleSearch(e) {
    e.preventDefault();
    if (checkIn && checkOut) {
      navigate(`/search?checkIn=${checkIn}&checkOut=${checkOut}`);
    } else {
      alert("Please select both check-in and check-out dates.");
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.topbar}>
        <p className="mb-0">Holidaze Bnb stays</p>
      </div>

      <nav className="navbar navbar-expand-lg px-3">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand d-flex align-items-center">
            <span className={styles.logoContainer}>
              <img src="/HolidazeLogo.png" alt="logo" className={styles.logo} />
            </span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            {/* Search Form */}
            <form className="d-flex mx-auto gap-2" onSubmit={handleSearch}>
              <input
                type="date"
                className="form-control"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="Check in"
                required
              />
              <input
                type="date"
                className="form-control"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="Check out"
                required
              />
              <button type="submit" className="btn btn-light">Search</button>
            </form>

            {/* User Menu */}
            <ul className="navbar-nav ms-auto">
              {user ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="profileDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle fs-5" />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li>
                      <NavLink className="dropdown-item" to="/profile">Profile</NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/bookings">My Bookings</NavLink>
                    </li>
                    {isVenueManager && (
                      <>
                        <li>
                          <NavLink className="dropdown-item" to="/venues/create">Create Venue</NavLink>
                        </li>
                        <li>
                          <NavLink className="dropdown-item" to="/venues/my">My Venues</NavLink>
                        </li>
                      </>
                    )}
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link text-white">Login</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link text-white">Register</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
