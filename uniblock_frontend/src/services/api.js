import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';  // Update this with your actual API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for sending cookies with requests
});

// 요청 인터셉터: 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to get CSRF token from cookies
function getCsrfToken() {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Add a request interceptor to include the CSRF token in the header
api.interceptors.request.use(
  (config) => {
    config.headers['X-CSRFToken'] = getCsrfToken();
    return config;
  },
  (error) => Promise.reject(error)
);

export const register = async (userData) => {
  const response = await api.post('/user/register/', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/user/login/', credentials);
  // localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/user/logout/');
  localStorage.removeItem('token');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/user/profile/');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/user/profile/', profileData);
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get('/post/');
  return response.data;
};

export const getPost = async (id) => {
  const response = await api.get(`/post/${id}/`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/post/', postData);
  return response.data;
};

export const voteOnPost = async (id, choice) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  formData.append('choice', choice);

  const response = await api.post(`/post/${id}/vote/`, formData, {
    headers: {
      'Authorization': `Token ${token}`,
      // Content-Type을 설정하지 않음. axios가 FormData를 감지하고 자동으로 설정함
    },
  });
  return response.data;
};

export const getTallyForPost = async (id) => {
  const response = await api.get(`/post/${id}/tally/`);
  return response.data;
};




export default api;