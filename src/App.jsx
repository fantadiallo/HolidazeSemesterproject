/**
 * App Component
 * Sets up the main application routes using React Router.
 * Applies authentication guard (authGuard) to protected routes such as profile, bookings, and venue management pages.
 *
 * Routes:
 * - /                : HomePage (public)
 * - /login           : LoginPage (public)
 * - /register        : RegisterPage (public)
 * - /profile         : ProfilePage (protected)
 * - /venue/:id       : VenuePage (public)
 * - /bookings        : BookingsPage (protected)
 * - /venues/create   : CreateVenuePage (protected)
 * - /venues/edit/:id : EditVenuePage (protected)
 * - /search          : SearchPage (public)
 * - *                : NotFoundPage (public, catch-all)
 *
 * @returns {JSX.Element} The rendered App component with routing and guards.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import VenuePage from './pages/VenuePage/VenuePage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import CreateVenuePage from './pages/CreateVenuePage/CreateVenuePage';
import EditVenuePage from './pages/EditVenuePage/EditVenuePage';
import SearchPage from './pages/SearchPage/SearchPage';
import authGuard from './utils/authGuard';


const ProtectedProfile = authGuard(ProfilePage);
const ProtectedBookings = authGuard(BookingsPage);
const ProtectedCreateVenue = authGuard(CreateVenuePage);
const ProtectedEditVenue = authGuard(EditVenuePage);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProtectedProfile />} />
          <Route path="venue/:id" element={<VenuePage />} />
          <Route path="bookings" element={<ProtectedBookings />} />
          <Route path="venues/create" element={<ProtectedCreateVenue />} />
          <Route path="venues/edit/:id" element={<ProtectedEditVenue />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
