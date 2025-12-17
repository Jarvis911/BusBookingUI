import { Trip, Booking, CreateBookingInput, Payment, LoginResponse, Route, BusDetail, BusAmenity, BookingDetail, Review, CreateReviewInput } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// --- Helper: Get stored auth token ---
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// --- Helper: Get stored refresh token ---
function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

// --- Helper: Refresh access token ---
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  // Prevent multiple simultaneous refresh requests
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logout();
    return false;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        // Some implementations also return a new refresh token
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        return true;
      }
    } catch (e) {
      console.error('Token refresh failed:', e);
    }

    // Refresh failed, clear tokens
    logout();
    return false;
  })();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

// --- Helper: Fetch with auth (auto-refresh on 401) ---
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  // If 401 Unauthorized, try to refresh the token and retry
  if (response.status === 401 && token) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry with new token
      const newToken = getAuthToken();
      if (newToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      }
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    }
  }
  
  return response;
}

// --- API Error Handler ---
export class ApiError extends Error {
  status: number;
  data: unknown;
  
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.detail || data.message || 'API Error',
      response.status,
      data
    );
  }
  
  return data as T;
}

// ============================================
// TRIPS API
// ============================================

export interface TripSearchParams {
  origin?: string;
  destination?: string;
  date?: string;
}

export async function fetchTrips(params: TripSearchParams = {}): Promise<Trip[]> {
  const searchParams = new URLSearchParams();
  
  if (params.origin) searchParams.append('origin', params.origin);
  if (params.destination) searchParams.append('destination', params.destination);
  if (params.date) searchParams.append('date', params.date);
  
  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/trips/${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return handleResponse<Trip[]>(response);
}

export async function fetchTripById(id: number): Promise<Trip> {
  const response = await fetch(`${API_BASE_URL}/trips/${id}/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return handleResponse<Trip>(response);
}

// ============================================
// ROUTES API
// ============================================

export async function fetchRoutes(): Promise<Route[]> {
  const response = await fetch(`${API_BASE_URL}/routes/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return handleResponse<Route[]>(response);
}

// ============================================
// BUSES API
// ============================================

export async function fetchBuses(): Promise<BusDetail[]> {
  const response = await fetch(`${API_BASE_URL}/buses/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return handleResponse<BusDetail[]>(response);
}

// ============================================
// AMENITIES API
// ============================================

export async function fetchAmenities(): Promise<BusAmenity[]> {
  const response = await fetch(`${API_BASE_URL}/amenities/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return handleResponse<BusAmenity[]>(response);
}

// ============================================
// BOOKINGS API
// ============================================

export async function createBooking(data: CreateBookingInput): Promise<{ message: string; data: Booking }> {
  const response = await fetchWithAuth(`${API_BASE_URL}/bookings/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  return handleResponse<{ message: string; data: Booking }>(response);
}

export async function fetchMyBookings(): Promise<BookingDetail[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/my-bookings/`);
  
  return handleResponse<BookingDetail[]>(response);
}

export async function getBookingPayment(bookingId: number): Promise<Payment> {
  const response = await fetchWithAuth(`${API_BASE_URL}/bookings/${bookingId}/payment/`);
  
  return handleResponse<Payment>(response);
}

// ============================================
// REVIEWS API
// ============================================

export async function fetchReviews(busId?: number): Promise<Review[]> {
  const url = busId 
    ? `${API_BASE_URL}/reviews/?bus_id=${busId}`
    : `${API_BASE_URL}/reviews/`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return handleResponse<Review[]>(response);
}

export async function createReview(data: CreateReviewInput): Promise<Review> {
  const response = await fetchWithAuth(`${API_BASE_URL}/reviews/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  return handleResponse<Review>(response);
}

// ============================================
// PAYMENTS API
// ============================================

export async function createMoMoPayment(bookingId: number): Promise<Payment> {
  const response = await fetchWithAuth(`${API_BASE_URL}/payments/momo/create/`, {
    method: 'POST',
    body: JSON.stringify({ booking_id: bookingId }),
  });
  
  return handleResponse<Payment>(response);
}

// ============================================
// AUTH API
// ============================================

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  
  const data = await handleResponse<LoginResponse>(response);
  
  // Store tokens
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }
  
  return data;
}

export async function register(
  username: string,
  email: string,
  password1: string,
  password2: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/registration/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password1, password2 }),
    credentials: 'include',
  });
  
  const data = await handleResponse<LoginResponse>(response);
  
  // Store tokens
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }
  
  return data;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export function isLoggedIn(): boolean {
  return !!getAuthToken();
}
