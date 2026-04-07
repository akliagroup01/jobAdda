import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  incrementView: (id) => api.post(`/jobs/${id}/view`),
};

// Applications API
export const applicationsAPI = {
  createApplication: (data) => api.post('/applications', data),
  getUserApplications: (userId) => api.get(`/applications/user/${userId}`),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

// Saved Jobs API
export const savedJobsAPI = {
  saveJob: (data) => api.post('/saved-jobs', data),
  getSavedJobs: (userId) => api.get(`/saved-jobs/user/${userId}`),
  unsaveJob: (jobId) => api.delete(`/saved-jobs/job/${jobId}`),
};

// Stats API
export const statsAPI = {
  getOverview: () => api.get('/stats/overview'),
  getEmployerStats: (employerId) => api.get(`/stats/employer/${employerId}`),
  getJobSeekerStats: (jobseekerId) => api.get(`/stats/jobseeker/${jobseekerId}`),
};

export default api;
