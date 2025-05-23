import { API_BASE } from "../utils/constants";
import { getHeaders } from "../utils/headers";

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

export async function fetchProfile(name) {
  try {
    const res = await fetch(
      `${API_BASE}/profiles/${name}?_bookings=true&_venues=true&_venues.bookings=true&_venues.owner=true`,
      {
        headers: getHeaders(true),
      }
    );

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

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

export async function deleteVenue(id) {
  const res = await fetch(`${API_BASE}/venues/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error("Failed to delete venue");
}
/**
 * Cancels a booking by ID
 * @param {string} bookingId
 * @returns {Promise<void>}
 */
export async function cancelBooking(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });

  if (!res.ok) {
    throw new Error("Failed to cancel booking");
  }
}
