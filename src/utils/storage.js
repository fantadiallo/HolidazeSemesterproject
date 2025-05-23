const USER_KEY = 'user';
const TOKEN_KEY = 'token';

/**
 * Saves the user object and token to localStorage.
 * @param {Object} user - The user object to save.
 * @param {string} token - The authentication token to save.
 */
export function saveUser(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieves the user object from localStorage.
 * @returns {Object|null} The user object, or null if not found.
 */
export function getUser() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string|null} The token, or null if not found.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Checks if the user is logged in by verifying the presence of a token.
 * @returns {boolean} True if logged in, false otherwise.
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * Checks if the current user is a venue manager.
 * @returns {boolean} True if the user is a venue manager, false otherwise.
 */
export function isVenueManager() {
  const user = getUser();
  return user?.venueManager || false;
}

/**
 * Logs out the user by removing user and token from localStorage.
 */
export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
