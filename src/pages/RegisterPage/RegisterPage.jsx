import { useState } from 'react';
import { registerUser } from '../../api/auth';
import { saveUser } from '../../utils/storage';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email.endsWith('@stud.noroff.no')) {
      setLoading(false);
      return setError('Email must end with @stud.noroff.no');
    }

    if (formData.password.length < 8) {
      setLoading(false);
      return setError('Password must be at least 8 characters');
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        venueManager: formData.venueManager,
      };

      const res = await registerUser(payload);
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
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email (@stud.noroff.no)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" name="venueManager" checked={formData.venueManager} onChange={handleChange} className="form-check-input" id="venueManagerCheck" />
              <label className="form-check-label" htmlFor="venueManagerCheck">
                I am a Venue Manager
              </label>
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
