export interface User {
  id: string;
  email: string;
  name: string;
  handicap: number;
  golfRating: number; // 0-10 rating
  avatar?: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  location: string;
  holes: number;
  par: number;
  rating: number;
  description?: string;
  amenities: string[];
  image_url?: string;
  // Optional fields that might be calculated or joined
  slope?: number;
  price?: number;
  lat?: number;
  lng?: number;
  booking_url?: string;
  address?: string;
}

export interface TeeTime {
  id: string;
  courseId: string;
  date: Date;
  time: string;
  availableSlots: number;
  price: number;
  players?: User[];
}

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  teeTimeId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  players: number;
  totalPrice: number;
  createdAt: Date;
}

export interface Round {
  id: string;
  user_id: string;
  course_id: string;
  date: Date;
  score: number;
  stableford_points?: number;
  notes?: string;
  // Optional joined fields
  course?: Course;
}

export interface Lesson {
  id: string;
  instructorName: string;
  location: string;
  date: Date;
  duration: number; // in minutes
  price: number;
  type: 'individual' | 'group';
  availableSlots: number;
}
