import { NavLink } from "react-router-dom";
import { getUser, logout } from "../../utils/storage";
import styles from "./Header.module.scss";

/**
 * Header Component
 * Renders the site header with navigation links, logo, and user menu.
 * Displays different navigation options based on user authentication and role.
 * @returns {JSX.Element} The rendered Header component.
 */
export default function Header() {
  const user = getUser();
  const isVenueManager = user?.venueManager;

  /**
   * Handles user logout and redirects to the home page.
   */
  function handleLogout() {
    logout();
    window.location.href = "/";
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
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav-link text-white${isActive ? ' active' : ''}`
                  }
                >
                  Book stay
                </NavLink>
              </li>
            </ul>

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

