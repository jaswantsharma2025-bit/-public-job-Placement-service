import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const API_BASE =
  ((import.meta as any).env?.VITE_API_URL as string) ||
  'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },
};

export const workerService = {
  getAll: async (params?: {
    skillCategory?: string;
    city?: string;
    isAvailable?: boolean;
    isVerified?: boolean;
  }) => {
    const response = await api.get('/workers', { params });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/workers/${id}`);
    return response.data.data;
  },

  updateAvailability: async (isAvailable: boolean) => {
    const response = await api.patch('/worker/availability', { isAvailable });
    return response.data;
  },

  updateLocation: async (data: { latitude: number; longitude: number; city: string; state: string }) => {
    const response = await api.patch('/worker/location', data);
    return response.data;
  },

  getEarnings: async () => {
    const response = await api.get('/worker/earnings');
    return response.data.data;
  },
};

export const bookingService = {
  create: async (data: {
    workerId: string;
    bookingType: string;
    serviceCategory: string;
    address: string;
    city: string;
    scheduledDate: string;
    durationMinutes: number;
    servicePrice: number;
    notes?: string;
  }) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data.data;
  },

  getWorkerBookings: async () => {
    const response = await api.get('/bookings/worker/my');
    return response.data.data;
  },

  acceptBooking: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/accept`);
    return response.data;
  },

  rejectBooking: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/reject`);
    return response.data;
  },

  startService: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/customer-start`);
    return response.data;
  },

  completeService: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/customer-complete`);
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  markNoShow: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/no-show`);
    return response.data;
  },

  markPaid: async (id: string, paymentMethod: string) => {
    const response = await api.patch(`/bookings/${id}/pay`, { paymentMethod });
    return response.data;
  },

  requestReplacement: async (id: string, reason: string) => {
    const response = await api.patch(`/bookings/${id}/replacement`, { reason });
    return response.data;
  },
};

export const reviewService = {
  create: async (data: { bookingId: string; rating: number; comment?: string }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getWorkerReviews: async (workerId: string) => {
    const response = await api.get(`/reviews/worker/${workerId}`);
    return response.data.data;
  },
};

export const complaintService = {
  create: async (data: {
    bookingId: string;
    againstUserId: string;
    reason: string;
    description?: string;
  }) => {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  getMy: async () => {
    const response = await api.get('/complaints/my');
    return response.data.data;
  },

  getAll: async () => {
    const response = await api.get('/complaints/admin');
    return response.data.data;
  },

  resolve: async (id: string, adminNotes?: string) => {
    const response = await api.patch(`/complaints/admin/${id}/resolve`, { adminNotes });
    return response.data;
  },

  reject: async (id: string, adminNotes?: string) => {
    const response = await api.patch(`/complaints/admin/${id}/reject`, { adminNotes });
    return response.data;
  },
};

export const adminService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data.data;
  },

  getPendingWorkers: async () => {
    const response = await api.get('/admin/workers/pending');
    return response.data.data;
  },

  approveWorker: async (userId: string) => {
    const response = await api.patch(`/admin/workers/${userId}/approve`);
    return response.data;
  },

  rejectWorker: async (userId: string, reason: string) => {
    const response = await api.patch(`/admin/workers/${userId}/reject`, { reason });
    return response.data;
  },

  // Fixed: backend requires reason in body
  suspendWorker: async (userId: string, reason: string) => {
    const response = await api.patch(`/admin/workers/${userId}/suspend`, { reason });
    return response.data;
  },

  reactivateWorker: async (userId: string) => {
    const response = await api.patch(`/admin/workers/${userId}/reactivate`);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data.data;
  },

  forceCompleteBooking: async (id: string) => {
    const response = await api.patch(`/admin/bookings/${id}/complete`);
    return response.data;
  },

  forceCancelBooking: async (id: string) => {
    const response = await api.patch(`/admin/bookings/${id}/cancel`);
    return response.data;
  },

  getReplacementCandidates: async (bookingId: string) => {
    const response = await api.get(`/admin/bookings/${bookingId}/replacement-candidates`);
    return response.data.data;
  },

  assignReplacement: async (bookingId: string, workerId: string) => {
    const response = await api.patch(`/admin/bookings/${bookingId}/reassign`, { newWorkerId: workerId });
    return response.data;
  },
};

export const profileService = {
  updateCustomer: async (data: {
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const response = await api.put('/customer/profile', data);
    return response.data;
  },

  getCustomerProfile: async () => {
    const response = await api.get('/customer/profile');
    return response.data.data;
  },

  createCustomerProfile: async (data: any) => {
    const response = await api.post('/customer/profile', data);
    return response.data;
  },

  updateWorker: async (data: {
    aadhaarNumber?: string;
    gender?: string;
    skillCategory?: string;
    experience?: number;
    expectedSalary?: number;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const response = await api.put('/worker/profile', data);
    return response.data;
  },

  getWorkerProfile: async () => {
    const response = await api.get('/worker/profile');
    return response.data.data;
  },
};