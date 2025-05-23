/**
 * RegisterPage Component
 * Renders a registration form that allows users to sign up as either a Customer or a Venue Manager.
 * 
 * Features:
 * - Validates email and password input
 * - Supports role selection with explanation (Customer vs Venue Manager)
 * - Handles form submission with loading spinner and success/error feedback
 * - Redirects to login on successful registration
 * 
 * @returns {JSX.Element} The rendered registration page component.
 */

import { useState } from 'react';
import { registerUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  /**
   * @typedef {Object} FormData
   * @property {string} name - Full name of the user.
   * @property {string} email - Must end with @stud.noroff.no.
   * @property {string} password - Password with minimum 8 characters.
   * @property {boolean} venueManager - Whether the user is registering as a venue manager.
   */

  /** @type {[FormData, Function]} */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });

  const navigate = useNavigate();

  /** @type {[string, Function]} */
  const [error, setError] = useState('');

  /** @type {[string, Function]} */
  const [success, setSuccess] = useState('');

  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(false);

  /**
   * Handles changes to form inputs and updates state accordingly.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  /**
   * Handles role toggle between Customer and Venue Manager.
   * @param {boolean} isManager
   */
  function handleRoleSelect(isManager) {
    setFormData((prev) => ({
      ...prev,
      venueManager: isManager,
    }));
  }

  /**
   * Submits the registration form and handles response.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email.endsWith('@stud.noroff.no')) {
      setLoading(false);
      setError('Email must end with @stud.noroff.no');
      return;
    }

    if (formData.password.length < 8) {
      setLoading(false);
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        venueManager: formData.venueManager,
      };

      await registerUser(payload);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <h1 className="text-center">Register</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email (@stud.noroff.no)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Register As</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="customerRadio"
                  checked={!formData.venueManager}
                  onChange={() => handleRoleSelect(false)}
                />
                <label className="form-check-label" htmlFor="customerRadio">
                  Customer
                </label>
                <small className="d-block text-muted ms-4">
                  Book venues and view your bookings.
                </small>
              </div>

              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="managerRadio"
                  checked={formData.venueManager}
                  onChange={() => handleRoleSelect(true)}
                />
                <label className="form-check-label" htmlFor="managerRadio">
                  Venue Manager
                </label>
                <small className="d-block text-muted ms-4">
                  Create and manage venues, and view bookings made by customers.
                </small>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
