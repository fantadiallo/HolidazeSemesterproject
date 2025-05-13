import { NavLink } from 'react-router-dom';
import { isLoggedIn, logout } from '../../utils/storage'; // Adjust path
import styles from './Header.module.scss';

export default function Header() {
  const loggedIn = isLoggedIn();

  function handleLogout() {
    logout();
    window.location.href = '/'; // Optional: force reload or use navigation
  }

  return (
    <header className={styles.header}>
      <div className={styles.topbar}>
        <p className="mb-0">Holidaze Bnb stays</p>
      </div>

      <nav className="navbar navbar-expand-lg px-3">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            <span className={styles.logoBox}>Holidaze</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink to="/" className="nav-link text-white">Home</NavLink>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto">
              {loggedIn ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="profileDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle fs-5"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li>
                      <NavLink className="dropdown-item" to="/profile">Profile</NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/bookings">My Bookings</NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/venues/create">Create Venue</NavLink>
                    </li>
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
