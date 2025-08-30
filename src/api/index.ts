import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
});
// A helper function to get headers with the user ID
const getAuthHeaders = (userId: string) => ({
    headers: {
      'x-user-id': userId,
    },
  });
// Socket.io connection
export const socket = io(API_URL);

// Disaster endpoints
export const createDisaster = (data: any, userId: string) => api.post('/disasters', data, getAuthHeaders(userId));
  
export const updateDisaster = (id: string, data: any, userId: string) => api.put(`/disasters/${id}`, data, getAuthHeaders(userId));
  
export const deleteDisaster = (id: string, userId: string) => api.delete(`/disasters/${id}`, getAuthHeaders(userId));

export const getDisasters = (tag?: string) => api.get('/disasters', { params: { tag } });

// Social Media endpoint
export const getSocialMediaReports = (disasterId: string) => api.get(`/disasters/${disasterId}/social-media`);

// Resources endpoint
export const getResources = (disasterId: string, lat: number, lon: number) => api.get(`/disasters/${disasterId}/resources`, { params: { lat, lon } });

// Official Updates endpoint
export const getOfficialUpdates = (disasterId: string) => api.get(`/disasters/${disasterId}/official-updates`);

// Image Verification endpoint
export const verifyImage = (disasterId: string, imageUrl: string) => api.post(`/disasters/${disasterId}/verify-image`, { imageUrl });

// Geocoding endpoint
export const geocodeLocation = (description: string) => api.post('/geocode', { description });

// Default export for other endpoints
export default api;
