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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="venue/:id" element={<VenuePage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="venues/create" element={<CreateVenuePage />} />
          <Route path="venues/edit/:id" element={<EditVenuePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

