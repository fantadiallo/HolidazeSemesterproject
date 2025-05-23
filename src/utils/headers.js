import { getToken } from './storage';
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Returns headers for API requests, including API key and optional auth token.
 *
 * @param {boolean} [auth=false] - Whether to include the Authorization header with the user's token.
 * @returns {Object} The headers object for fetch requests.
 */
export function getHeaders(auth = false) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': API_KEY,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}
