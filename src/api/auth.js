const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Registers a new user with the provided data.
 * @param {Object} data - The registration data (e.g., name, email, password).
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Error} If registration fails, throws an error with the API message.
 */
export async function registerUser(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || "Registration failed");
  }

  return await response.json();
}

/**
 * Logs in a user with the provided credentials.
 * @param {Object} credentials - The login credentials (e.g., email, password).
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Error} If login fails, throws an error with the API message.
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || "Login failed");
  }

  return await response.json();
}
