const API_BASE = 'https://v2.api.noroff.dev';
const API_KEY = import.meta.env.VITE_API_KEY;

export async function registerUser(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Registration failed');
  }

  return await response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Login failed');
  }

  return await response.json();
}
