import { API_BASE } from "../utils/constants";
import { getHeaders } from "../utils/headers";

/**
 * Fetch bookings for a given profile name.
 * @param {string} name - The user's profile name.
 * @returns {Promise<Array>} - The bookings array or empty array.
 */
export async function getBookingsByUser(name) {
  try {
    const res = await fetch(`${API_BASE}/profiles/${name}/bookings?_venue=true`, {
      headers: getHeaders(true),
    });

    const { data } = await res.json();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
}

/**
 * Fetch the user's full profile including bookings and venues.
 * @param {string} name - The user's profile name.
 * @returns {Promise<Object>} - The profile data.
 */
export async function fetchProfile(name) {
  try {
    const res = await fetch(`${API_BASE}/profiles/${name}?_bookings=true&_venues=true`, {
      headers: getHeaders(true),
    });

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

/**
 * Update the user's avatar image.
 * @param {string} name - The user's profile name.
 * @param {string} avatarUrl - The new avatar image URL.
 * @returns {Promise<Object>} - The updated profile data.
 */
export async function updateAvatar(name, avatarUrl) {
  const body = {
    avatar: {
      url: avatarUrl,
      alt: `${name}'s profile picture`,
    },
  };

  try {
    const res = await fetch(`${API_BASE}/profiles/${name}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(body),
    });

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to update avatar:", error);
    return null;
  }
}

/**
 * Deletes a venue by its ID.
 * Sends a DELETE request to the API to remove the specified venue.
 *
 * @param {string} id - The ID of the venue to delete.
 * @returns {Promise<void>} Resolves if the venue is deleted successfully.
 * @throws {Error} If the API request fails.
 */
export async function deleteVenue(id) {
  const res = await fetch(`${API_BASE}/venues/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error('Failed to delete venue');
}
