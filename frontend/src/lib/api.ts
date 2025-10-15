import { fetchWithAuth } from './fetchWithAuth';

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  let data;

  try {
    data = await res.json();
  } catch (error) {
    data = {};
  }

  if (!res.ok) {
    const message = data?.message || data?.error || 'Invalid credentials';
    throw new Error(message);
  }

  return data;
}

export async function refreshToken() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to refresh token');

  const data = await res.json();

  sessionStorage.setItem('token', data.accessToken);

  return data.accessToken;
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
  is_customer: boolean,
  is_provider: boolean,
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, is_customer, is_provider }),
  });

  if (!res.ok) {
    throw new Error('Signup failed');
  }

  return res.json();
}

export async function fetchServices(cursor?: string) {
  try {
    const url = cursor
      ? `${process.env.NEXT_PUBLIC_API_URL}/services?cursor=${cursor}`
      : `${process.env.NEXT_PUBLIC_API_URL}/services`;

    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error('Failed to fetch services');

    return res.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return { data: [] };
  }
}

export async function fetchServiceById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch service');

    return await res.json();
  } catch (error) {
    console.log('Error fetching service:', error);
    return null;
  }
}

export async function fetchServiceReviews(serviceId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/service/${serviceId}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch reviews');

    return await res.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function createBooking(serviceId: string, token: string) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${serviceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

export async function initialisePayment(bookingId: string, amount: number, token: string) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/payments/initialise`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId, amount }),
  });

  if (!res.ok) throw new Error('Failed to initialise payment');

  return res.json();
}

export async function fetchBookings(token: string, cursor?: string) {
  try {
    const url = cursor
      ? `${process.env.NEXT_PUBLIC_API_URL}/bookings?cursor=${cursor}`
      : `${process.env.NEXT_PUBLIC_API_URL}/bookings`;

    const res = await fetchWithAuth(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch bookings');

    return res.json();
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return { data: [] };
  }
}

export async function deleteBooking(bookingId: string, token: string) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to delete booking');

  return res.json();
}

export async function createReview(
  bookingId: string,
  rating: number,
  comment: string,
  token: string,
) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId, rating, comment }),
  });

  if (!res.ok) throw new Error('Failed to submit review');

  return res.json();
}
