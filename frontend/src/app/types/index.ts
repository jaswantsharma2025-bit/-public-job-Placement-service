export type Role = 'CUSTOMER' | 'WORKER' | 'ADMIN' | 'EMPLOYER';

export type SkillCategory = 'MAID' | 'COOK' | 'DRIVER' | 'NURSE' | 'PLUMBER' | 'ELECTRICIAN';

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export type BookingType = 'INSTANT' | 'SCHEDULED';

export type PaymentStatus = 'PENDING' | 'PAID';

export type ComplaintStatus = 'OPEN' | 'RESOLVED' | 'REJECTED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Worker extends User {
  aadhaarNumber?: string;
  skillCategory: SkillCategory;
  experience: number;
  expectedSalary: number;
  rating: number;
  isAvailable: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
}

export interface Booking {
  id: string;
  customerId: string;
  workerId: string;
  bookingType: BookingType;
  serviceCategory: SkillCategory;
  address: string;
  city: string;
  scheduledDate?: string;
  durationMinutes: number;
  servicePrice: number;
  notes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  worker?: Worker;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  workerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer?: User;
  booking?: Booking;
}

export interface Complaint {
  id: string;
  bookingId: string;
  customerId: string;
  againstUserId: string;
  reason: string;
  description: string;
  status: ComplaintStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
  customer?: User;
  againstUser?: User;
}

export interface AdminAnalytics {
  totalCustomers: number;
  totalWorkers: number;
  verifiedWorkers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

export interface WorkerEarnings {
  totalBookings: number;
  totalEarnings: number;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}
