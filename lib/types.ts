// TypeScript types matching Django API responses

// --- Bus & Amenities ---
export interface BusAmenity {
  id: number;
  name: string;
  icon_image: string | null;
  description: string;
}

export interface BusImage {
  id: number;
  image: string;
  caption: string;
}

export interface BusDetail {
  id: number;
  LICENSE_PLATE: string;
  bus_type: string;
  total_seats: number;
  main_image: string | null;
  images: BusImage[];
  amenities: BusAmenity[];
  policy: string;
  description: string;
  average_rating: number;
}

// --- Route & Points ---
export interface RoutePoint {
  id: number;
  name: string;
  address: string;
  point_type: 'PICKUP' | 'DROPOFF' | 'BOTH';
  type_display: string;
  order: number;
  surcharge: number;
}

export interface Route {
  id: number;
  origin: string;
  destination: string;
  base_price: number;
  duration_hours: number;
  points: RoutePoint[];
}

// --- Trip & Seat ---
export interface SeatInfo {
  number: number;
  is_booked: boolean;
}

export interface Trip {
  id: number;
  route: Route;
  bus: BusDetail;
  departure_time: string;
  arrival_time: string;
  status: string;
  seat_map: SeatInfo[];
}

// --- Booking ---
export interface Booking {
  id: number;
  trip: number;
  seat_number: number;
  pickup_point: number;
  dropoff_point: number;
  price_paid: number;
  status: string;
}

export interface BookingDetail {
  id: number;
  trip: Trip;
  seat_number: number;
  pickup_point: RoutePoint;
  dropoff_point: RoutePoint;
  price_paid: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  status_display: string;
  booking_time: string;
  has_review: boolean;
}

export interface CreateBookingInput {
  trip: number;
  seat_number: number;
  pickup_point: number;
  dropoff_point: number;
}

// --- Review ---
export interface Review {
  id: number;
  user_name: string;
  user_avatar: string;
  rating: number;
  comment: string;
  image: string | null;
  created_at: string;
}

export interface CreateReviewInput {
  booking: number;
  rating: number;
  comment: string;
  image?: File;
}

// --- Payment ---
export interface Payment {
  id: number;
  order_id: string;
  trans_id: string | null;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  status_display: string;
  pay_url: string | null;
  deeplink: string | null;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
}

// --- Auth ---
export interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
