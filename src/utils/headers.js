import { getToken } from './storage';
const API_KEY = import.meta.env.VITE_API_KEY;

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
